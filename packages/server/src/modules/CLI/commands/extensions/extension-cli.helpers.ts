import type { Knex } from 'knex';
import {
  extensionMigrationDirectories,
  nativeExtensions,
} from '@/extensions/generated/extensions.generated';
import type { ExtensionMigrationResult } from '@/extensions/migrations/extension-migration.runner';
import { runExtensionMigrations } from '@/extensions/migrations/extension-migration.runner';

export interface CompiledExtensionInfo {
  id: string;
  name: string;
  version: string;
  hasMigrations: boolean;
  migrationsDirectory?: string;
}

export function getCompiledExtensions(): CompiledExtensionInfo[] {
  return nativeExtensions.map((extension) => ({
    id: extension.manifest.id,
    name: extension.manifest.name,
    version: extension.manifest.version,
    hasMigrations: Boolean(extension.manifest.migrations),
    migrationsDirectory: extensionMigrationDirectories[extension.manifest.id],
  }));
}

export function getCompiledExtension(
  extensionId: string,
): CompiledExtensionInfo | undefined {
  return getCompiledExtensions().find(
    (extension) => extension.id === extensionId,
  );
}

export async function getCatalogExtension(
  systemKnex: Knex,
  extensionId: string,
) {
  return systemKnex('extensions').where({ extensionId }).first() as Promise<
    | {
        extensionId: string;
        version: string;
        status: string;
      }
    | undefined
  >;
}

/**
 * Ensures a tenant row exists before migrating or enabling.
 */
export async function ensureTenantRecord(
  systemKnex: Knex,
  extensionId: string,
  organizationId: string,
  version: string,
) {
  const existing = await systemKnex('extension_tenants')
    .where({ extensionId, organizationId })
    .first();

  if (existing) {
    return existing;
  }

  const now = new Date();

  await systemKnex('extension_tenants').insert({
    extensionId,
    organizationId,
    version,
    status: 'disabled',
    createdAt: now,
    updatedAt: now,
  });

  return systemKnex('extension_tenants')
    .where({ extensionId, organizationId })
    .first();
}

/**
 * Runs extension migrations and updates the tenant migration status.
 */
export async function migrateCompiledExtension(
  systemKnex: Knex,
  tenantKnex: Knex,
  extensionId: string,
  organizationId: string,
): Promise<ExtensionMigrationResult> {
  const compiled = getCompiledExtension(extensionId);

  if (!compiled) {
    throw new Error(
      `Extension "${extensionId}" is not compiled into this deployment. Run "pnpm extensions:sync" and rebuild the server.`,
    );
  }

  if (!compiled.hasMigrations) {
    return {
      extensionId,
      organizationId,
      applied: [],
      skipped: true,
      reason: 'not-configured',
    };
  }

  if (!compiled.migrationsDirectory) {
    throw new Error(
      `No migration directory is registered for extension "${extensionId}". Run "pnpm extensions:sync" and redeploy.`,
    );
  }

  const record = await ensureTenantRecord(
    systemKnex,
    extensionId,
    organizationId,
    compiled.version,
  );
  const restoreStatus = record?.status === 'enabled' ? 'enabled' : 'disabled';

  await systemKnex('extension_tenants')
    .where({ extensionId, organizationId })
    .update({ status: 'migrating', lastError: null });

  try {
    const result = await runExtensionMigrations({
      knex: tenantKnex,
      extensionId,
      organizationId,
      migrationsDirectory: compiled.migrationsDirectory,
    });

    await systemKnex('extension_tenants')
      .where({ extensionId, organizationId })
      .update({
        version: compiled.version,
        status: restoreStatus,
        lastError: null,
      });

    return result;
  } catch (error) {
    await systemKnex('extension_tenants')
      .where({ extensionId, organizationId })
      .update({
        status: 'failed',
        lastError: error instanceof Error ? error.message : String(error),
      });
    throw error;
  }
}
