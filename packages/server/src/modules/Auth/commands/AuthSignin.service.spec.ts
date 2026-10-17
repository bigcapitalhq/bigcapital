import { UnauthorizedException } from '@nestjs/common';
import { AuthSigninService } from './AuthSignin.service';
import { JWT_ISSUER, JWT_AUDIENCE } from '../Auth.constants';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';

describe('AuthSigninService token claims', () => {
  const userId = 42;
  const user = { id: userId, email: 'owner@corp.com', active: true } as any;

  const createService = (foundUser: any = user) => {
    const findOne = jest.fn().mockImplementation(() => {
      const result = Promise.resolve(foundUser);
      (result as any).throwIfNotFound = () => result;
      return result;
    });
    const query = jest.fn(() => ({ findOne }));
    const systemUserModel = { query } as any;
    const clsService = { set: jest.fn() } as any;
    const jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    } as any;
    const service = new AuthSigninService(
      systemUserModel,
      {} as any,
      {} as any,
      jwtService,
      clsService,
    );
    return { service, findOne, clsService, jwtService };
  };

  describe('verifyPayload', () => {
    it('resolves the user by the id carried in sub, not by email', async () => {
      const { service, findOne, clsService } = createService();
      const payload = {
        sub: String(userId),
        iss: JWT_ISSUER,
        aud: JWT_AUDIENCE,
        iat: 1,
        exp: 2,
      };

      await service.verifyPayload(payload);

      expect(findOne).toHaveBeenCalledWith({ id: userId });
      expect(findOne).not.toHaveBeenCalledWith(
        expect.objectContaining({ email: expect.anything() }),
      );
      expect(clsService.set).toHaveBeenCalledWith('userId', userId);
    });

    it('throws when the user does not exist', async () => {
      const { service } = createService(null);
      const payload = {
        sub: '999',
        iss: JWT_ISSUER,
        aud: JWT_AUDIENCE,
        iat: 1,
        exp: 2,
      };

      await expect(service.verifyPayload(payload)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('never resolves identity from a token without the expected issuer/audience', async () => {
      const { service, findOne } = createService();
      const claims: Array<Partial<{ iss: string; aud: string }>> = [
        { iss: 'attacker', aud: JWT_AUDIENCE },
        { iss: JWT_ISSUER, aud: 'attacker' },
        {},
      ];

      for (const partial of claims) {
        await expect(
          service.verifyPayload({ sub: String(userId), ...partial } as any),
        ).rejects.toThrow(UnauthorizedException);
      }
      expect(findOne).not.toHaveBeenCalled();
    });
  });

  describe('signToken', () => {
    it('embeds the user id as sub with issuer/audience claims', () => {
      const { service, jwtService } = createService();

      service.signToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: String(userId) },
        {
          expiresIn: '1d',
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
        },
      );
    });

    it('extends the lifetime when rememberMe is set', () => {
      const { service, jwtService } = createService();

      service.signToken(user, true);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: String(userId) },
        expect.objectContaining({ expiresIn: '30d' }),
      );
    });
  });
});

import { InvalidEmailPasswordException } from '../exceptions/InvalidEmailPassword.exception';

jest.mock('@/modules/System/models/SystemUser', () => ({
  SystemUser: class SystemUser {},
}));
jest.mock('@/modules/System/models/TenantModel', () => ({
  TenantModel: class TenantModel {},
}));
jest.mock('@/modules/System/models/UserTenant.model', () => ({
  UserTenant: class UserTenant {},
}));

describe('user activity during authentication', () => {
  const email = 'staff@example.test';
  const payload = {
    sub: String(7),
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    iat: 1,
    exp: 2,
  };
  let user: any;
  let cls: any;
  let service: AuthSigninService;

  beforeEach(() => {
    user = {
      id: 7,
      email,
      active: true,
      checkPassword: jest.fn().mockResolvedValue(true),
    };
    cls = { set: jest.fn() };
    const users = {
      query: () => ({
        findOne: () => ({
          throwIfNotFound: async () => {
            if (!user) throw new Error('missing user');
            return user;
          },
        }),
      }),
    };
    service = new AuthSigninService(
      users as any,
      {} as any,
      {} as any,
      {} as any,
      cls,
    );
  });

  it('refuses the same password after the user is inactivated', async () => {
    await expect(service.signin(email, 'valid-password')).resolves.toBe(user);
    user.active = false;
    await expect(
      service.signin(email, 'valid-password'),
    ).rejects.toBeInstanceOf(InvalidEmailPasswordException);
  });

  it('refuses an existing session after the user is inactivated', async () => {
    await expect(service.verifyPayload(payload)).resolves.toBe(payload);
    cls.set.mockClear();
    user.active = false;
    await expect(service.verifyPayload(payload)).rejects.toBeInstanceOf(
      UserNotFoundException,
    );
    expect(cls.set).not.toHaveBeenCalled();
  });

  it('still refuses invalid passwords', async () => {
    user.checkPassword.mockResolvedValue(false);
    await expect(service.signin(email, 'invalid')).rejects.toBeInstanceOf(
      InvalidEmailPasswordException,
    );
  });

  it('refuses deleted users without setting the request identity', async () => {
    user = undefined;
    await expect(service.signin(email, 'password')).rejects.toBeInstanceOf(
      InvalidEmailPasswordException,
    );
    await expect(service.verifyPayload(payload)).rejects.toBeInstanceOf(
      UserNotFoundException,
    );
    expect(cls.set).not.toHaveBeenCalled();
  });
});
