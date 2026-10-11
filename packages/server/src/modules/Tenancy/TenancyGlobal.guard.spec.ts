import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenancyGlobalGuard } from './TenancyGlobal.guard';

const mockQuery = (resolvedValue: any) => ({
  findOne: jest.fn().mockResolvedValue(resolvedValue),
});

describe('TenancyGlobalGuard', () => {
  let guard: TenancyGlobalGuard;
  let tenantQuery: { findOne: jest.Mock };
  let membershipQuery: { findOne: jest.Mock };
  let metadata: Record<string, any>;
  let reflector: { getAllAndOverride: jest.Mock };

  const buildContext = (headers: any = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ headers }) }),
      getHandler: () => () => undefined,
      getClass: () => class Handler {},
    } as any);

  beforeEach(() => {
    tenantQuery = mockQuery(undefined);
    membershipQuery = mockQuery(undefined);
    metadata = {};
    reflector = {
      getAllAndOverride: jest.fn((key: string) => metadata[key]),
    } as any;

    guard = new TenancyGlobalGuard(
      { query: () => tenantQuery } as any,
      { query: () => tenantQuery } as any,
      reflector as any,
      { get: jest.fn().mockReturnValue(1) } as any,
    );
    // Re-bind the tenant model mock to return tenantQuery and the userTenant
    // model mock to return membershipQuery.
    (guard as any).tenantModel = { query: () => tenantQuery };
    (guard as any).userTenantModel = { query: () => membershipQuery };
  });

  it('rejects requests targeting an inactive tenant', async () => {
    tenantQuery.findOne.mockResolvedValue({ isActive: false });

    await expect(
      guard.canActivate(
        buildContext({
          'organization-id': 'org-1',
          authorization: 'Bearer jwt-token',
        }),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('allows requests targeting an active tenant with a valid membership', async () => {
    tenantQuery.findOne.mockResolvedValue({ isActive: true });
    membershipQuery.findOne.mockResolvedValue({ id: 9 });

    await expect(
      guard.canActivate(
        buildContext({
          'organization-id': 'org-1',
          authorization: 'Bearer jwt-token',
        }),
      ),
    ).resolves.toBe(true);
  });

  it('still rejects inactive tenants even with a valid membership', async () => {
    tenantQuery.findOne.mockResolvedValue({ isActive: false });
    membershipQuery.findOne.mockResolvedValue({ id: 9 });

    await expect(
      guard.canActivate(
        buildContext({
          'organization-id': 'org-1',
          authorization: 'Bearer jwt-token',
        }),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('allows an inactive tenant when @AllowInactiveTenant() is set', async () => {
    metadata['ALLOW_INACTIVE_TENANT'] = true;
    tenantQuery.findOne.mockResolvedValue({ isActive: false });
    membershipQuery.findOne.mockResolvedValue({ id: 9 });

    await expect(
      guard.canActivate(
        buildContext({
          'organization-id': 'org-1',
          authorization: 'Bearer jwt-token',
        }),
      ),
    ).resolves.toBe(true);
  });
});
