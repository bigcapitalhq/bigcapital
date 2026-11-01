import { Ability } from '@casl/ability';
import { AuthorizationGuard } from './Authorization.guard';
import { getCachedAbility, purgeTenantAbilities } from './TenantAbilities';

describe('AuthorizationGuard', () => {
  const organizationId = 'org-a';
  const userId = 10;

  let clsStore: Record<string, any>;
  let clsService: any;
  let withGraphFetched: jest.Mock;
  let findOne: jest.Mock;
  let tenantUserModel: any;

  const buildContext = () =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user: { sub: String(userId) } }),
      }),
    }) as any;

  const buildRole = (slug: string, permissions: any[] = []) => ({
    slug,
    permissions,
  });

  beforeEach(() => {
    purgeTenantAbilities(organizationId);
    purgeTenantAbilities('org-b');
    clsStore = { userId, organizationId };
    clsService = { get: jest.fn((key: string) => clsStore[key]) };
    withGraphFetched = jest.fn();
    findOne = jest.fn(() => ({ withGraphFetched }));
    tenantUserModel = jest.fn(() => ({ query: () => ({ findOne }) }));
  });

  it('caches the ability of the tenant system user', async () => {
    withGraphFetched.mockResolvedValue({ role: buildRole('admin') });
    const guard = new AuthorizationGuard(clsService, tenantUserModel as any);

    await guard.canActivate(buildContext());
    await guard.canActivate(buildContext());

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(getCachedAbility(organizationId, userId)).toBeDefined();
  });

  it('keys the cache by the CLS user id not the JWT payload id', async () => {
    withGraphFetched.mockResolvedValue({ role: buildRole('admin') });
    const guard = new AuthorizationGuard(clsService, tenantUserModel as any);

    await guard.canActivate(buildContext());

    expect(getCachedAbility(organizationId, userId)).toBeDefined();
    expect(getCachedAbility(organizationId, undefined as any)).toBeUndefined();
  });

  it('does not serve an ability cached for another tenant', async () => {
    withGraphFetched
      .mockResolvedValueOnce({ role: buildRole('admin') })
      .mockResolvedValueOnce({ role: buildRole('viewer', []) });
    const guard = new AuthorizationGuard(clsService, tenantUserModel as any);
    const requestA: any = { user: { sub: String(userId) } };

    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => requestA }),
    } as any);
    expect(requestA.ability.can('manage', 'all')).toBe(true);

    clsStore.organizationId = 'org-b';
    const requestB: any = { user: { sub: String(userId) } };
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => requestB }),
    } as any);

    expect(findOne).toHaveBeenCalledTimes(2);
    expect(requestB.ability.can('manage', 'all')).toBe(false);
  });

  it('does not cache when the organization id is missing', async () => {
    clsStore.organizationId = undefined;
    withGraphFetched.mockResolvedValue({ role: buildRole('admin') });
    const guard = new AuthorizationGuard(clsService, tenantUserModel as any);
    const request: any = { user: { sub: String(userId) } };

    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => request }),
    } as any);

    clsStore.organizationId = organizationId;
    const cachedRequest: any = { user: { sub: String(userId) } };
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => cachedRequest }),
    } as any);

    expect(findOne).toHaveBeenCalledTimes(2);
    expect(cachedRequest.ability).not.toBe(request.ability);
  });

  it('returns the cached ability instance on subsequent requests', async () => {
    withGraphFetched.mockResolvedValue({ role: buildRole('admin') });
    const guard = new AuthorizationGuard(clsService, tenantUserModel as any);
    const requestA: any = { user: { sub: String(userId) } };
    const requestB: any = { user: { sub: String(userId) } };

    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => requestA }),
    } as any);
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => requestB }),
    } as any);

    expect(requestB.ability).toBeInstanceOf(Ability);
    expect(requestB.ability).toBe(requestA.ability);
  });
});
