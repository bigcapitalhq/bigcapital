import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionMigrationService } from './extension-migration.service';
import type { ValidatedExtension } from '../extension.types';

const buildService = () => {
  const enabled = parseExtensionManifest({
    id: 'acme.defaults',
    name: 'Acme Defaults',
    version: '1.0.0',
    trust: 'partner',
    defaultEnabled: true,
  });
  const disabled = parseExtensionManifest({
    id: 'acme.optional',
    name: 'Acme Optional',
    version: '1.0.0',
    trust: 'partner',
    defaultEnabled: false,
  });
  const extensions = [enabled, disabled].map(
    (manifest) =>
      ({
        manifest,
        createModule: () => ({ module: class TestModule {} }),
      }) as ValidatedExtension,
  );
  const manager = {
    ensureTenantRecord: jest.fn().mockResolvedValue({}),
    enable: jest.fn().mockResolvedValue({}),
    getExtension: jest.fn(),
    getTenantRecord: jest.fn(),
    isEnabled: jest.fn(),
  };
  const registry = {
    getManifest: jest.fn(),
  };

  const service = new ExtensionMigrationService(
    jest.fn() as any,
    {} as any,
    extensions,
    manager as any,
    registry as any,
  );

  return { service, manager, enabled };
};

describe('ExtensionMigrationService', () => {
  it('provisions only extensions marked defaultEnabled', async () => {
    const { service, manager, enabled } = buildService();
    const migrate = jest.spyOn(service, 'migrate').mockResolvedValue({
      extensionId: enabled.id,
      organizationId: 'org-1',
      applied: [],
      skipped: true,
      reason: 'not-configured',
    });

    const ids = await service.enableDefaults('org-1');

    expect(ids).toEqual([enabled.id]);
    expect(manager.ensureTenantRecord).toHaveBeenCalledWith(
      enabled.id,
      'org-1',
    );
    expect(migrate).toHaveBeenCalledWith(enabled.id, 'org-1');
    expect(manager.enable).toHaveBeenCalledWith(enabled.id, 'org-1');
  });

  it('does nothing when no extensions are default-enabled', async () => {
    const { service, manager } = buildService();
    manager.ensureTenantRecord.mockClear();

    const emptyService = new ExtensionMigrationService(
      jest.fn() as any,
      {} as any,
      [],
      manager as any,
      { getManifest: jest.fn() } as any,
    );

    await expect(emptyService.enableDefaults('org-1')).resolves.toEqual([]);
    expect(manager.ensureTenantRecord).not.toHaveBeenCalled();
  });
});
