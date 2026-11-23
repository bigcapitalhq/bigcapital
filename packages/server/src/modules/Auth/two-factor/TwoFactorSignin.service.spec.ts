import { TwoFactorSigninService } from './TwoFactorSignin.service';
import {
  TwoFactorChallengeInvalidException,
  TwoFactorCodeInvalidException,
  TwoFactorMethodUnavailableException,
  TwoFactorTooManyAttemptsException,
} from './TwoFactor.exceptions';

describe('TwoFactorSigninService', () => {
  const user = { id: 7, email: 'owner@example.com' } as any;
  const tenant = { id: 3, organizationId: 'org' } as any;
  const challenge = {
    id: 11,
    userId: 7,
    rememberMe: true,
    methods: JSON.stringify(['totp', 'recovery_code']),
  } as any;
  const totpMethod = { id: 'totp', kind: 'otp' };
  const recoveryMethod = { id: 'recovery_code', kind: 'recovery_code' };

  const setup = () => {
    const findById = jest.fn().mockResolvedValue(user);
    const systemUserModel = { query: () => ({ findById }) } as any;
    const twoFactorService = {
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
      getMethods: jest.fn().mockReturnValue(['totp', 'recovery_code']),
      markMethod: jest.fn().mockResolvedValue(undefined),
    };
    const policyService = {
      isRequiredForTenant: jest.fn().mockResolvedValue(false),
    };
    const provider = {
      id: 'totp',
      kind: 'otp',
      isEnrolled: jest.fn().mockResolvedValue(true),
      verify: jest.fn((userId: number, credential: any) =>
        twoFactorService.verifySecondFactor(userId, credential),
      ),
      startSetup: jest.fn(async (userId: number) => ({
        method: 'totp',
        ...(await twoFactorService.startSetup(userId)),
      })),
      confirmSetup: jest.fn((userId: number, code: string) =>
        twoFactorService.tryConfirmSetup(userId, code),
      ),
    };
    const registry = {
      getEnrolledMethods: jest.fn().mockResolvedValue([]),
      getEnrollableMethods: jest.fn().mockReturnValue([totpMethod]),
      require: jest.fn().mockReturnValue(provider),
      hasAnyEnrolled: jest.fn().mockResolvedValue(false),
    };
    const service = new TwoFactorSigninService(
      systemUserModel,
      challengeService as any,
      policyService as any,
      registry as any,
    );
    return {
      service,
      twoFactorService,
      challengeService,
      policyService,
      registry,
      provider,
    };
  };

  describe('begin', () => {
    it('signs in directly without two-factor and without the requirement', async () => {
      const { service, challengeService } = setup();

      await expect(service.begin(user, tenant)).resolves.toBeNull();
      expect(challengeService.issue).not.toHaveBeenCalled();
    });

    it('asks for a code when the user has two-factor', async () => {
      const { service, registry, challengeService } = setup();
      registry.getEnrolledMethods.mockResolvedValue([
        totpMethod,
        recoveryMethod,
      ]);

      const result = await service.begin(user, tenant, true);

      expect(result).toMatchObject({
        twoFactorRequired: true,
        challengeToken: 'tok',
        challengeExpiresIn: 300,
        purpose: 'verify',
        availableMethods: [totpMethod, recoveryMethod],
        defaultMethod: 'totp',
        mfa: {
          challengeToken: 'tok',
          expiresIn: 300,
          purpose: 'verify',
          methods: [totpMethod, recoveryMethod],
          defaultMethod: 'totp',
        },
      });
      expect(challengeService.issue).toHaveBeenCalledWith(7, 'verify', true, [
        'totp',
        'recovery_code',
      ]);
    });

    it('asks for a setup when the organization requires two-factor', async () => {
      const { service, policyService, challengeService } = setup();
      policyService.isRequiredForTenant.mockResolvedValue(true);

      const response = await service.begin(user, tenant);

      expect(response).toMatchObject({
        twoFactorSetupRequired: true,
        challengeToken: 'tok',
        purpose: 'setup',
        availableMethods: [totpMethod],
        defaultMethod: 'totp',
      });
      expect(response).not.toHaveProperty('accessToken');
      expect(challengeService.issue).toHaveBeenCalledWith(7, 'setup', false, [
        'totp',
      ]);
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
      expect(challengeService.markMethod).toHaveBeenCalledWith(
        challenge,
        'totp',
      );
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

    it('verifies a recovery code as its own method', async () => {
      const { service, twoFactorService, challengeService } = setup();

      await expect(
        service.complete('tok', undefined, 'k7m2-q9xd-3fha-p8tw'),
      ).resolves.toEqual({ user, rememberMe: true });
      expect(twoFactorService.verifySecondFactor).toHaveBeenCalledWith(7, {
        code: undefined,
        recoveryCode: 'k7m2-q9xd-3fha-p8tw',
      });
      expect(challengeService.markMethod).toHaveBeenCalledWith(
        challenge,
        'recovery_code',
      );
    });
  });

  describe('prepare', () => {
    it('readies the selected method without counting an attempt', async () => {
      const { service, challengeService } = setup();

      await expect(service.prepare('tok', 'totp')).resolves.toEqual({
        method: 'totp',
        ready: true,
      });
      expect(challengeService.registerAttempt).not.toHaveBeenCalled();
    });

    it('refuses a method that the challenge did not offer', async () => {
      const { service, challengeService } = setup();
      challengeService.getMethods.mockReturnValue(['recovery_code']);

      await expect(service.prepare('tok', 'totp')).rejects.toBeInstanceOf(
        TwoFactorMethodUnavailableException,
      );
    });
  });

  describe('setup during sign-in', () => {
    it('starts the setup for the challenge user', async () => {
      const { service, twoFactorService, challengeService } = setup();

      await expect(service.startSetup('tok')).resolves.toEqual({
        method: 'totp',
        secret: 'S',
        otpauthUrl: 'U',
      });
      expect(challengeService.find).toHaveBeenCalledWith('tok', 'setup');
      expect(twoFactorService.startSetup).toHaveBeenCalledWith(7);
      expect(challengeService.markMethod).toHaveBeenCalledWith(
        challenge,
        'totp',
      );
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
