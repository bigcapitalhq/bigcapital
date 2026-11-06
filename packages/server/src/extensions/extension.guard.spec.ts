import { ForbiddenException } from '@nestjs/common';
import { ExtensionEnabledGuard } from './extension.guard';

const buildHttpContext = (path: string) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ path, url: path }),
    }),
  }) as any;

const buildGuard = (enabled: boolean, organizationId?: string) => {
  const manager = {
    isEnabled: jest.fn().mockResolvedValue(enabled),
  };
  const cls = {
    get: jest.fn().mockReturnValue(organizationId),
  };

  return {
    guard: new ExtensionEnabledGuard(manager as any, cls as any),
    manager,
  };
};

describe('ExtensionEnabledGuard', () => {
  it('allows non-extension routes without checking enablement', async () => {
    const { guard, manager } = buildGuard(false, 'org-1');

    await expect(
      guard.canActivate(buildHttpContext('/api/invoices')),
    ).resolves.toBe(true);
    expect(manager.isEnabled).not.toHaveBeenCalled();
  });

  it('allows extension routes when the extension is enabled', async () => {
    const { guard, manager } = buildGuard(true, 'org-1');

    await expect(
      guard.canActivate(buildHttpContext('/api/ext/acme.reports/reports')),
    ).resolves.toBe(true);
    expect(manager.isEnabled).toHaveBeenCalledWith('acme.reports', 'org-1');
  });

  it('rejects extension routes when the extension is disabled', async () => {
    const { guard } = buildGuard(false, 'org-1');

    await expect(
      guard.canActivate(buildHttpContext('/api/ext/acme.reports/reports')),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('leaves requests without a tenant context to the tenancy guards', async () => {
    const { guard, manager } = buildGuard(false);

    await expect(
      guard.canActivate(buildHttpContext('/api/ext/acme.reports/reports')),
    ).resolves.toBe(true);
    expect(manager.isEnabled).not.toHaveBeenCalled();
  });

  it('decodes url-encoded extension ids', async () => {
    const { guard, manager } = buildGuard(true, 'org-1');

    await expect(
      guard.canActivate(
        buildHttpContext('/api/ext/acme.reports%2Fbeta/reports'),
      ),
    ).resolves.toBe(true);
    expect(manager.isEnabled).toHaveBeenCalledWith(
      'acme.reports/beta',
      'org-1',
    );
  });
});
