import { UnauthorizedException } from '@nestjs/common';
import { AuthSigninService } from './AuthSignin.service';
import { JWT_ISSUER, JWT_AUDIENCE } from '../Auth.constants';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';

describe('AuthSigninService token claims', () => {
  const userId = 42;
  const user = { id: userId, email: 'owner@corp.com' } as any;

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
      undefined,
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

  it('rejects organization-scoped sessions when the organization sign-in provider is absent', async () => {
    const { service } = createService({
      ...user,
      active: true,
      verified: true,
    });
    const payload = {
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
      sub: String(userId),
      samlOrganizationId: 'org-a',
      iat: 1,
      exp: 2,
    };
    await expect(service.verifyPayload(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(
      service.issueSigninResponse(user, false, 'org-a'),
    ).rejects.toThrow(UnauthorizedException);
  });

  describe('SAML session issuance', () => {
    const member = {
      ...user,
      active: true,
      verified: true,
      defaultTenantId: 17,
    };
    const samlOrg = { id: 3, organizationId: 'org-a', isActive: true };
    const membershipQuery = {
      where: jest.fn().mockReturnThis(),
      withGraphFetched: jest.fn().mockReturnThis(),
      first: jest.fn(),
    };
    const sign = jest.fn(() => 'scoped-token');
    const service = new AuthSigninService(
      {} as any,
      { resolveTenantId: async () => samlOrg.id } as any,
      { query: () => membershipQuery } as any,
      { sign } as any,
      {} as any,
    );

    it('issues a token for the IdP organization even when the member has a different default', async () => {
      membershipQuery.first.mockResolvedValue({ tenant: samlOrg });
      const response = await service.issueSigninResponse(
        member,
        false,
        'org-a',
      );
      expect(membershipQuery.where).toHaveBeenCalledWith({
        userId,
        tenantId: samlOrg.id,
      });
      expect(response.organizationId).toBe('org-a');
      expect(sign).toHaveBeenCalledWith(
        { sub: String(userId), samlOrganizationId: 'org-a' },
        expect.anything(),
      );
    });

    it('denies an account without an active membership in the asserted organization', async () => {
      membershipQuery.first.mockResolvedValue(undefined);
      await expect(
        service.issueSigninResponse(member, false, 'org-a'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.issueSigninResponse(
          { ...member, active: false },
          false,
          'org-a',
        ),
      ).rejects.toThrow(UnauthorizedException);
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
