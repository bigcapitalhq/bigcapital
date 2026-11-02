import { BadRequestException } from '@nestjs/common';
import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionsController } from './extensions.controller';
import { ExtensionSettingsValidationError } from '../settings/extension-settings.service';

const manifest = parseExtensionManifest({
  id: 'acme.reports',
  name: 'Acme Reports',
  version: '1.0.0',
  trust: 'partner',
});

const buildController = () => {
  const manager = {
    listForOrganization: jest.fn().mockResolvedValue([
      {
        id: 'acme.reports',
        name: 'Acme Reports',
        version: '1.0.0',
        enabled: true,
        settings: { page_size: 25 },
      },
    ]),
    getExtension: jest.fn().mockResolvedValue({
      extensionId: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
      status: 'active',
    }),
    getTenantRecord: jest.fn().mockResolvedValue({
      status: 'enabled',
      version: '1.0.0',
      settings: { page_size: 25 },
    }),
    isEnabled: jest.fn().mockResolvedValue(true),
    ensureTenantRecord: jest.fn().mockResolvedValue({}),
    enable: jest.fn().mockResolvedValue({ status: 'enabled' }),
    disable: jest.fn().mockResolvedValue({ status: 'disabled' }),
  };
  const registry = {
    getManifest: jest.fn().mockReturnValue(manifest),
  };
  const settings = {
    getAdminSettingsOrStored: jest.fn((_id, stored) => stored),
    getAdminSettingsForOrganization: jest
      .fn()
      .mockResolvedValue({ page_size: 25 }),
    updateSettings: jest.fn().mockResolvedValue({ page_size: 50 }),
  };
  const migrations = {
    migrate: jest.fn().mockResolvedValue({
      extensionId: 'acme.reports',
      organizationId: 'org-1',
      applied: ['001.js'],
      batch: 1,
      skipped: false,
    }),
    getHealth: jest.fn().mockResolvedValue({ enabled: true }),
  };
  const cls = {
    get: jest.fn().mockReturnValue('org-1'),
  };

  return {
    controller: new ExtensionsController(
      manager as any,
      registry as any,
      settings as any,
      migrations as any,
      cls as any,
    ),
    manager,
    settings,
    migrations,
  };
};

describe('ExtensionsController', () => {
  it('lists extensions with admin-safe settings', async () => {
    const { controller, settings } = buildController();

    const result = await controller.list();

    expect(settings.getAdminSettingsOrStored).toHaveBeenCalledWith(
      'acme.reports',
      { page_size: 25 },
    );
    expect(result).toHaveLength(1);
  });

  it('runs migrations before enabling', async () => {
    const { controller, manager, migrations } = buildController();

    await controller.enable('acme.reports');

    expect(manager.ensureTenantRecord).toHaveBeenCalledWith(
      'acme.reports',
      'org-1',
    );
    expect(migrations.migrate).toHaveBeenCalledWith('acme.reports', 'org-1');
    expect(manager.enable).toHaveBeenCalledWith('acme.reports', 'org-1');
    expect(migrations.migrate.mock.invocationCallOrder[0]).toBeLessThan(
      manager.enable.mock.invocationCallOrder[0],
    );
  });

  it('maps settings validation errors to a bad request', async () => {
    const { controller, settings } = buildController();
    settings.updateSettings.mockRejectedValue(
      new ExtensionSettingsValidationError([
        'Setting "page_size" must be a number.',
      ]),
    );

    await expect(
      controller.updateSettings('acme.reports', {
        page_size: 'large',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns health data', async () => {
    const { controller, migrations } = buildController();

    await expect(controller.health('acme.reports')).resolves.toEqual({
      enabled: true,
    });
    expect(migrations.getHealth).toHaveBeenCalledWith('acme.reports', 'org-1');
  });
});
