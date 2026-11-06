import * as fs from 'node:fs';
import type { Knex } from 'knex';
import { extensionMigrationTable } from '@bigcapital/extension-sdk';

export interface RunExtensionMigrationsOptions {
  knex: Knex;
  extensionId: string;
  organizationId: string;
  /**
   * Absolute directory containing the extension's compiled migrations.
   */
  migrationsDirectory?: string;
  /**
   * How long to wait for the per-extension migration lock, in seconds.
   */
  lockTimeoutSeconds?: number;
}

export interface ExtensionMigrationResult {
  extensionId: string;
  organizationId: string;
  applied: string[];
  batch?: number;
  skipped: boolean;
  reason?: 'not-configured' | 'no-migrations';
}

/**
 * Builds a MySQL advisory-lock name scoped to one tenant and extension.
 *
 * `GET_LOCK` names are limited to 64 characters, so reuse the sanitized
 * migration-table helper and include the organization id in the hash input.
 */
export function extensionMigrationLockName(
  organizationId: string,
  extensionId: string,
): string {
  return extensionMigrationTable(`lock:${organizationId}:${extensionId}`);
}

/**
 * Runs an extension's tenant migrations.
 *
 * Migrations are tracked in a per-extension knex table so uninstalling an
 * extension cannot affect another extension's migration history. A MySQL
 * advisory lock prevents concurrent enable/migrate requests from racing.
 */
export async function runExtensionMigrations({
  knex,
  extensionId,
  organizationId,
  migrationsDirectory,
  lockTimeoutSeconds = 30,
}: RunExtensionMigrationsOptions): Promise<ExtensionMigrationResult> {
  if (!migrationsDirectory) {
    return {
      extensionId,
      organizationId,
      applied: [],
      skipped: true,
      reason: 'not-configured',
    };
  }

  if (!fs.existsSync(migrationsDirectory)) {
    throw new Error(
      `Migration directory "${migrationsDirectory}" for extension "${extensionId}" does not exist. Rebuild the extension package (pnpm extensions:sync).`,
    );
  }

  const lockName = extensionMigrationLockName(organizationId, extensionId);
  const [lockRows] = (await knex.raw('SELECT GET_LOCK(?, ?) AS acquired', [
    lockName,
    lockTimeoutSeconds,
  ])) as unknown as [Array<{ acquired: number | string }>];

  if (Number(lockRows?.[0]?.acquired) !== 1) {
    throw new Error(
      `Timed out waiting for the migration lock for extension "${extensionId}". Another migration or enable request is in progress.`,
    );
  }

  try {
    const [batch, log] = await knex.migrate.latest({
      directory: migrationsDirectory,
      tableName: extensionMigrationTable(extensionId),
      loadExtensions: ['.js', '.cjs'],
    });

    return {
      extensionId,
      organizationId,
      applied: log,
      batch,
      skipped: false,
      ...(log.length === 0 ? { reason: 'no-migrations' as const } : {}),
    };
  } finally {
    await knex.raw('SELECT RELEASE_LOCK(?)', [lockName]);
  }
}
