import { AuthApiKeyAuthorizeService } from './AuthApiKeyAuthorization.service';

describe('AuthApiKeyAuthorizeService', () => {
  let service: AuthApiKeyAuthorizeService;
  let apiKeyFindOne: jest.Mock;
  let tenantFindById: jest.Mock;
  let clsSet: jest.Mock;

  beforeEach(() => {
    apiKeyFindOne = jest.fn();
    tenantFindById = jest.fn();
    clsSet = jest.fn();

    service = new AuthApiKeyAuthorizeService(
      { set: clsSet } as any,
      { query: () => ({ findOne: apiKeyFindOne }) } as any,
      { query: () => ({ findById: tenantFindById }) } as any,
    );
  });

  const validKey = {
    key: 'k_123',
    revoked: false,
    expiresAt: null,
    tenantId: 7,
    userId: 2,
  };

  it('rejects when the tenant is inactive', async () => {
    apiKeyFindOne.mockResolvedValue(validKey);
    tenantFindById.mockResolvedValue({ isActive: false });

    await expect(service.authorize('k_123')).resolves.toBe(false);
    expect(clsSet).not.toHaveBeenCalled();
  });

  it('authorizes when the tenant is active', async () => {
    apiKeyFindOne.mockResolvedValue(validKey);
    tenantFindById.mockResolvedValue({ isActive: true, organizationId: 'org-1' });

    await expect(service.authorize('k_123')).resolves.toBe(true);
    expect(clsSet).toHaveBeenCalledWith('organizationId', 'org-1');
  });
});
