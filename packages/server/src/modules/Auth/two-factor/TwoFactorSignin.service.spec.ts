import { TwoFactorSigninService } from './TwoFactorSignin.service';
import {
  TwoFactorChallengeInvalidException,
  TwoFactorCodeInvalidException,
  TwoFactorTooManyAttemptsException,
} from './TwoFactor.exceptions';

describe('TwoFactorSigninService', () => {
  const user = { id: 7, email: 'owner@example.com' } as any;
  const tenant = { id: 3, organizationId: 'org' } as any;
  const challenge = { id: 11, userId: 7, rememberMe: true } as any;

  const setup = () => {
    const findById = jest.fn().mockResolvedValue(user);
    const systemUserModel = { query: () => ({ findById }) } as any;
    const twoFactorService = {
      isEnabled: jest.fn().mockResolvedValue(false),
      verifySecondFactor: jest.fn().mockResolvedValue(true),
      startSetup: jest.fn().mockResolvedValue({ secret: 'S', otpauthUrl: 'U' }),
      tryConfirmSetup: jest.fn().mockResolvedValue(['code-1', 'code-2']),
    };
    const challengeService = {
      issue: jest.fn().mockResolvedValue({ token: 'tok', expiresIn: 300 }),
      find: jest.fn().mockResolvedValue(challenge),
      isUserLocked: jest.fn().mockResolvedValue(false),
      registerAttempt: jest.fn().mockResolvedValue(true),
      consume: jest.fn().mockResolvedValue(true),
    };
    const policyService = {
      isRequiredForTenant: jest.fn().mockResolvedValue(false),
    };
    const service = new TwoFactorSigninService(
      systemUserModel,
      twoFactorService as any,
      challengeService as any,
      policyService as any,
    );
    return { service, twoFactorService, challengeService, policyService };
  };

  describe('begin', () => {
    it('signs in directly without two-factor and without the requirement', async () => {
      const { service, challengeService } = setup();

      await expect(service.begin(user, tenant)).resolves.toBeNull();
      expect(challengeService.issue).not.toHaveBeenCalled();
    });

    it('asks for a code when the user has two-factor', async () => {
      const { service, twoFactorService, challengeService } = setup();
      twoFactorService.isEnabled.mockResolvedValue(true);

      await expect(service.begin(user, tenant, true)).resolves.toEqual({
        twoFactorRequired: true,
        challengeToken: 'tok',
        challengeExpiresIn: 300,
      });
      expect(challengeService.issue).toHaveBeenCalledWith(7, 'verify', true);
    });

    it('asks for a setup when the organization requires two-factor', async () => {
      const { service, policyService, challengeService } = setup();
      policyService.isRequiredForTenant.mockResolvedValue(true);

      const response = await service.begin(user, tenant);

      expect(response).toMatchObject({
        twoFactorSetupRequired: true,
        challengeToken: 'tok',
      });
      expect(response).not.toHaveProperty('accessToken');
      expect(challengeService.issue).toHaveBeenCalledWith(7, 'setup', false);
    });
  });

  describe('complete', () => {
    it('returns the user and the remember-me choice of the password step', async () => {
      const { service, twoFactorService, challengeService } = setup();

      await expect(service.complete('tok', '123456')).resolves.toEqual({
        user,
        rememberMe: true,
      });
      expect(challengeService.find).toHaveBeenCalledWith('tok', 'verify');
      expect(twoFactorService.verifySecondFactor).toHaveBeenCalledWith(7, {
        code: '123456',
        recoveryCode: undefined,
      });
      expect(challengeService.consume).toHaveBeenCalledWith(challenge);
    });

    it('refuses an unknown, expired or used challenge', async () => {
      const { service, challengeService, twoFactorService } = setup();
      challengeService.find.mockResolvedValue(null);

      await expect(service.complete('nope', '123456')).rejects.toBeInstanceOf(
        TwoFactorChallengeInvalidException,
      );
      expect(twoFactorService.verifySecondFactor).not.toHaveBeenCalled();
    });

    it('refuses when the challenge has no attempts left', async () => {
      const { service, challengeService, twoFactorService } = setup();
      challengeService.registerAttempt.mockResolvedValue(false);

      await expect(service.complete('tok', '123456')).rejects.toBeInstanceOf(
        TwoFactorChallengeInvalidException,
      );
      expect(twoFactorService.verifySecondFactor).not.toHaveBeenCalled();
    });

    it('answers 429 after too many wrong codes for the user', async () => {
      const { service, challengeService } = setup();
      challengeService.isUserLocked.mockResolvedValue(true);

      await expect(service.complete('tok', '123456')).rejects.toBeInstanceOf(
        TwoFactorTooManyAttemptsException,
      );
      expect(challengeService.registerAttempt).not.toHaveBeenCalled();
    });

    it('refuses a wrong code without using up the challenge', async () => {
      const { service, twoFactorService, challengeService } = setup();
      twoFactorService.verifySecondFactor.mockResolvedValue(false);

      await expect(service.complete('tok', '000000')).rejects.toBeInstanceOf(
        TwoFactorCodeInvalidException,
      );
      expect(challengeService.consume).not.toHaveBeenCalled();
    });

    it('refuses a challenge that was used meanwhile', async () => {
      const { service, challengeService } = setup();
      challengeService.consume.mockResolvedValue(false);

      await expect(service.complete('tok', '123456')).rejects.toBeInstanceOf(
        TwoFactorChallengeInvalidException,
      );
    });
  });

  describe('setup during sign-in', () => {
    it('starts the setup for the challenge user', async () => {
      const { service, twoFactorService, challengeService } = setup();

      await expect(service.startSetup('tok')).resolves.toEqual({
        secret: 'S',
        otpauthUrl: 'U',
      });
      expect(challengeService.find).toHaveBeenCalledWith('tok', 'setup');
      expect(twoFactorService.startSetup).toHaveBeenCalledWith(7);
    });

    it('confirms the setup and returns the recovery codes', async () => {
      const { service } = setup();

      await expect(service.confirmSetup('tok', '123456')).resolves.toEqual({
        user,
        rememberMe: true,
        recoveryCodes: ['code-1', 'code-2'],
      });
    });

    it('refuses a wrong setup code', async () => {
      const { service, twoFactorService, challengeService } = setup();
      twoFactorService.tryConfirmSetup.mockResolvedValue(null);

      await expect(
        service.confirmSetup('tok', '000000'),
      ).rejects.toBeInstanceOf(TwoFactorCodeInvalidException);
      expect(challengeService.consume).not.toHaveBeenCalled();
    });

    it('does not accept a verify challenge for the setup', async () => {
      const { service, challengeService } = setup();
      challengeService.find.mockResolvedValue(null);

      await expect(service.startSetup('tok')).rejects.toBeInstanceOf(
        TwoFactorChallengeInvalidException,
      );
    });
  });
});
