import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionManager } from './extension.manager';
import type { ValidatedExtension } from './extension.types';

const buildManager = (
  record: unknown,
  options: Record<string, unknown> = {},
  extensionStatus: string | null = 'active',
) => {
  const findOne = jest.fn().mockResolvedValue(record);
  const extensionTenantModel = {
    query: () => ({ findOne }),
  };
  const extensionModel = {
    query: () => ({
      findOne: jest
        .fn()
        .mockResolvedValue(
          extensionStatus ? { status: extensionStatus } : undefined,
        ),
      orderBy: jest.fn().mockResolvedValue([]),
    }),
  };

  const manager = new ExtensionManager(
    extensionModel as any,
    extensionTenantModel as any,
    { emitAsync: jest.fn() } as any,
    [],
    options,
  );

  return { manager, findOne };
};

describe('ExtensionManager catalog sync', () => {
  const buildExtension = (): ValidatedExtension =>
    ({
      manifest: parseExtensionManifest({
        id: 'acme.reports',
        name: 'Acme Reports',
        version: '1.0.0',
        trust: 'partner',
      }),
      createModule: () => ({ module: class TestModule {} }),
    }) as ValidatedExtension;

  it('inserts a new catalog entry', async () => {
    const patch = jest.fn();
    const insert = jest.fn().mockResolvedValue({});
    const query = {
      findOne: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockReturnValue({ patch }),
      insert,
    };
    const eventEmitter = { emitAsync: jest.fn() };

    const manager = new ExtensionManager(
      { query: () => query } as any,
      { query: () => ({ findOne: jest.fn() }) } as any,
      eventEmitter as any,
      [buildExtension()],
      {},
    );

    await manager.syncCatalog();

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        extensionId: 'acme.reports',
        name: 'Acme Reports',
        version: '1.0.0',
        trust: 'partner',
        status: 'active',
      }),
    );
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      'onExtensionCatalogSynced',
      { extensionIds: ['acme.reports'] },
    );
  });

  it('recovers when another instance wins the insert race', async () => {
    const patch = jest.fn().mockResolvedValue({});
    const insert = jest.fn().mockRejectedValue({ code: 'ER_DUP_ENTRY' });
    const findOne = jest
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ id: 10 });
    const query = {
      findOne,
      findById: jest.fn().mockReturnValue({ patch }),
      insert,
    };

    const manager = new ExtensionManager(
      { query: () => query } as any,
      { query: () => ({ findOne: jest.fn() }) } as any,
      { emitAsync: jest.fn() } as any,
      [buildExtension()],
      {},
    );

    await manager.syncCatalog();

    expect(insert).toHaveBeenCalled();
    expect(patch).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Acme Reports',
      }),
    );
  });

  it('updates an existing catalog entry', async () => {
    const patch = jest.fn().mockResolvedValue({});
    const insert = jest.fn();
    const query = {
      findOne: jest.fn().mockResolvedValue({ id: 10 }),
      findById: jest.fn().mockReturnValue({ patch }),
      insert,
    };

    const manager = new ExtensionManager(
      { query: () => query } as any,
      { query: () => ({ findOne: jest.fn() }) } as any,
      { emitAsync: jest.fn() } as any,
      [buildExtension()],
      {},
    );

    await manager.syncCatalog();

    expect(patch).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Acme Reports',
        version: '1.0.0',
      }),
    );
    expect(insert).not.toHaveBeenCalled();
  });
});

describe('ExtensionManager enablement cache', () => {
  it('returns false when there is no tenant context', async () => {
    const { manager, findOne } = buildManager({ id: 1 });

    await expect(manager.isEnabled('acme.reports')).resolves.toBe(false);
    expect(findOne).not.toHaveBeenCalled();
  });

  it('returns false when the extension is globally disabled', async () => {
    const { manager, findOne } = buildManager({ id: 1 }, {}, 'disabled');

    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      false,
    );
    expect(findOne).not.toHaveBeenCalled();
  });

  it('returns false when the extension is not installed', async () => {
    const { manager, findOne } = buildManager({ id: 1 }, {}, null);

    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      false,
    );
    expect(findOne).not.toHaveBeenCalled();
  });

  it('caches enabled results per tenant and extension', async () => {
    const { manager, findOne } = buildManager({ id: 1 });

    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      true,
    );
    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      true,
    );

    expect(findOne).toHaveBeenCalledTimes(1);
  });

  it('caches disabled results', async () => {
    const { manager, findOne } = buildManager(undefined);

    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      false,
    );
    await expect(manager.isEnabled('acme.reports', 'org-1')).resolves.toBe(
      false,
    );

    expect(findOne).toHaveBeenCalledTimes(1);
  });

  it('invalidates a tenant entry', async () => {
    const { manager, findOne } = buildManager({ id: 1 });

    await manager.isEnabled('acme.reports', 'org-1');
    manager.invalidate('acme.reports', 'org-1');
    await manager.isEnabled('acme.reports', 'org-1');

    expect(findOne).toHaveBeenCalledTimes(2);
  });

  it('clears the whole cache', async () => {
    const { manager, findOne } = buildManager({ id: 1 });

    await manager.isEnabled('acme.reports', 'org-1');
    manager.clearCache();
    await manager.isEnabled('acme.reports', 'org-1');

    expect(findOne).toHaveBeenCalledTimes(2);
  });

  it('evicts the oldest entry when the cache is full', async () => {
    const { manager, findOne } = buildManager(
      { id: 1 },
      { enablementCacheMaxEntries: 1 },
    );

    await manager.isEnabled('acme.one', 'org-1');
    await manager.isEnabled('acme.two', 'org-1');
    await manager.isEnabled('acme.one', 'org-1');

    expect(findOne).toHaveBeenCalledTimes(3);
  });
});
