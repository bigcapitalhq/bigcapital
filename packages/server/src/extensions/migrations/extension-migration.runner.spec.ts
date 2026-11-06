import * as fs from 'node:fs';
import { extensionMigrationTable } from '@bigcapital/extension-sdk';
import {
  extensionMigrationLockName,
  runExtensionMigrations,
} from './extension-migration.runner';

const buildKnex = (acquired: number) => {
  const raw = jest
    .fn()
    .mockResolvedValueOnce([[{ acquired }]])
    .mockResolvedValueOnce([{}]);
  const latest = jest.fn().mockResolvedValue([3, ['001_create_table.js']]);

  return {
    knex: { raw, migrate: { latest } } as any,
    raw,
    latest,
  };
};

describe('runExtensionMigrations', () => {
  it('skips when no migration directory is configured', async () => {
    const { knex } = buildKnex(1);

    const result = await runExtensionMigrations({
      knex,
      extensionId: 'acme.reports',
      organizationId: 'org-1',
    });

    expect(result).toMatchObject({
      skipped: true,
      reason: 'not-configured',
      applied: [],
    });
    expect(knex.migrate.latest).not.toHaveBeenCalled();
  });

  it('fails when the configured directory is missing', async () => {
    const { knex } = buildKnex(1);
    const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await expect(
      runExtensionMigrations({
        knex,
        extensionId: 'acme.reports',
        organizationId: 'org-1',
        migrationsDirectory: '/tmp/missing',
      }),
    ).rejects.toThrow(/does not exist/);

    existsSync.mockRestore();
  });

  it('locks, runs the per-extension migration table, and releases', async () => {
    const { knex, raw, latest } = buildKnex(1);
    const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = await runExtensionMigrations({
      knex,
      extensionId: 'acme.reports',
      organizationId: 'org-1',
      migrationsDirectory: '/tmp/migrations',
      lockTimeoutSeconds: 12,
    });

    expect(result).toMatchObject({
      applied: ['001_create_table.js'],
      batch: 3,
      skipped: false,
    });
    expect(raw).toHaveBeenNthCalledWith(
      1,
      'SELECT GET_LOCK(?, ?) AS acquired',
      [extensionMigrationLockName('org-1', 'acme.reports'), 12],
    );
    expect(latest).toHaveBeenCalledWith(
      expect.objectContaining({
        directory: '/tmp/migrations',
        tableName: extensionMigrationTable('acme.reports'),
        loadExtensions: ['.js', '.cjs'],
      }),
    );
    expect(raw).toHaveBeenNthCalledWith(2, 'SELECT RELEASE_LOCK(?)', [
      extensionMigrationLockName('org-1', 'acme.reports'),
    ]);

    existsSync.mockRestore();
  });

  it('fails when the advisory lock cannot be acquired', async () => {
    const { knex, latest } = buildKnex(0);
    const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await expect(
      runExtensionMigrations({
        knex,
        extensionId: 'acme.reports',
        organizationId: 'org-1',
        migrationsDirectory: '/tmp/migrations',
      }),
    ).rejects.toThrow(/Timed out waiting for the migration lock/);

    expect(latest).not.toHaveBeenCalled();
    existsSync.mockRestore();
  });

  it('keeps the lock name within MySQL limits', () => {
    const lockName = extensionMigrationLockName(
      'a'.repeat(64),
      '@bigcapital/example-reports',
    );

    expect(lockName.length).toBeLessThanOrEqual(64);
  });
});
