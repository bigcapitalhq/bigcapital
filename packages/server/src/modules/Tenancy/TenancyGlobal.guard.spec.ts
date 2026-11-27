import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { ORGANIZATION_SESSION_ALLOWED } from '../Auth/OrganizationSession.decorator';
import { TenantModel } from '../System/models/TenantModel';
import { UserTenant } from '../System/models/UserTenant.model';
import { IS_TENANT_AGNOSTIC, TenancyGlobalGuard } from './TenancyGlobal.guard';

describe('organization-scoped sessions', () => {
  const membership = jest.fn();
  const tenant = jest.fn();
  const cls = { get: () => 7, set: jest.fn() };
  const handler = () => {};
  const guard = new TenancyGlobalGuard(
    { query: () => ({ findOne: membership }) } as unknown as typeof UserTenant,
    { query: () => ({ findOne: tenant }) } as unknown as typeof TenantModel,
    new Reflector(),
    cls as unknown as ClsService,
  );
  const check = (organizationId?: string) =>
    guard.canActivate({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'organization-id': organizationId },
          user: { sub: '7', scopedOrganizationId: 'org-a' },
        }),
      }),
      getHandler: () => handler,
      getClass: () => Object,
    } as unknown as ExecutionContext);

  beforeEach(() => {
    jest.resetAllMocks();
    Reflect.deleteMetadata(ORGANIZATION_SESSION_ALLOWED, handler);
    Reflect.deleteMetadata(IS_TENANT_AGNOSTIC, handler);
    tenant.mockResolvedValue({ id: 2, isActive: true });
    membership.mockResolvedValue({ id: 3 });
  });

  it('uses only the organization in the SAML claim', async () => {
    await expect(check('org-b')).rejects.toThrow(ForbiddenException);
    expect(tenant).not.toHaveBeenCalled();
    await expect(check('org-a')).resolves.toBe(true);
    expect(tenant).toHaveBeenCalledWith({ organizationId: 'org-a' });
    expect(membership).toHaveBeenCalledWith({ userId: 7, tenantId: 2 });
  });

  it('requires explicit opt-in for account-wide routes and rechecks membership', async () => {
    Reflect.defineMetadata(IS_TENANT_AGNOSTIC, true, handler);
    await expect(check()).rejects.toThrow(ForbiddenException);
    Reflect.defineMetadata(ORGANIZATION_SESSION_ALLOWED, true, handler);
    await expect(check()).resolves.toBe(true);
    expect(cls.set).toHaveBeenCalledWith('scopedTenantId', 2);
    membership.mockResolvedValue(undefined);
    await expect(check()).rejects.toThrow(UnauthorizedException);
  });

  it('blocks actions that mint account credentials or affect other workspaces', async () => {
    Reflect.defineMetadata(ORGANIZATION_SESSION_ALLOWED, false, handler);
    await expect(check('org-a')).rejects.toThrow(ForbiddenException);
  });
});
