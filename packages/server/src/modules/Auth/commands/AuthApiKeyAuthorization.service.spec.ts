jest.mock('bcrypt', () => ({}), { virtual: true });
import { AuthApiKeyPrefix } from '../Auth.constants';
import { AuthApiKeyAuthorizeService } from './AuthApiKeyAuthorization.service';

jest.mock('../models/ApiKey.model', () => ({
  ApiKeyModel: class ApiKeyModel {},
}));
jest.mock('@/modules/System/models/TenantModel', () => ({
  TenantModel: class TenantModel {},
}));
jest.mock('@/modules/System/models/SystemUser', () => ({
  SystemUser: class SystemUser {},
}));

describe('API key owner activity', () => {
  let owner: any;
  let key: any;
  let tenant: any;
  let cls: any;
  let service: AuthApiKeyAuthorizeService;

  beforeEach(() => {
    owner = { id: 7, active: true };
    key = { userId: owner.id, tenantId: 3, revoked: false, expiresAt: null };
    tenant = { organizationId: 'test-organization' };
    cls = { set: jest.fn() };
    const keys = { query: () => ({ findOne: async () => key }) };
    const tenants = { query: () => ({ findById: async () => tenant }) };
    const users = {
      query: () => ({
        findById: async (id: number) => (owner?.id === id ? owner : undefined),
      }),
    };
    service = new AuthApiKeyAuthorizeService(
      cls,
      keys as any,
      tenants as any,
      users as any,
    );
  });

  it('refuses the same key after its owner is inactivated', async () => {
    await expect(
      service.authorize(AuthApiKeyPrefix + 'synthetic-owner-check'),
    ).resolves.toBe(true);
    expect(cls.set).toHaveBeenCalledWith('userId', owner.id);
    cls.set.mockClear();
    owner.active = false;
    await expect(
      service.authorize(AuthApiKeyPrefix + 'synthetic-owner-check'),
    ).resolves.toBe(false);
    expect(cls.set).not.toHaveBeenCalled();
  });

  it('refuses a deleted owner without setting the request identity', async () => {
    owner = undefined;
    await expect(
      service.authorize(AuthApiKeyPrefix + 'synthetic-owner-check'),
    ).resolves.toBe(false);
    expect(cls.set).not.toHaveBeenCalled();
  });

  it.each(['missing', 'revoked', 'expired', 'missing tenant'])(
    'still refuses %s keys',
    async (reason) => {
      if (reason === 'missing') key = undefined;
      if (reason === 'revoked') key.revoked = true;
      if (reason === 'expired') key.expiresAt = new Date(0);
      if (reason === 'missing tenant') tenant = undefined;
      await expect(
        service.authorize(AuthApiKeyPrefix + 'synthetic-owner-check'),
      ).resolves.toBe(false);
      expect(cls.set).not.toHaveBeenCalled();
    },
  );
});
