import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import { extensionMigrationTable } from '@bigcapital/extension-sdk';
import { TENANCY_DB_CONNECTION } from '../../modules/Tenancy/TenancyDB/TenancyDB.constants';
import {
  EXTENSION_OPTIONS_TOKEN,
  EXTENSIONS_TOKEN,
} from '../extension.constants';
import { ExtensionNotFoundError } from '../extension.errors';
import { ExtensionManager } from '../extension.manager';
import { ExtensionContributionRegistry } from '../extension.registry';
import type {
  ExtensionsModuleOptions,
  ValidatedExtension,
} from '../extension.types';
import {
  runExtensionMigrations,
  type ExtensionMigrationResult,
} from './extension-migration.runner';

export interface ExtensionHealth {
  extensionId: string;
  installedVersion: string;
  tenantVersion?: string;
  status?: string;
  enabled: boolean;
  lastError?: string;
  migrationTable: string;
  appliedMigrations?: number;
  latestBatch?: number;
}

/**
 * Tenant-scoped extension migrations.
 *
 * Migrations run synchronously during enable or an explicit migrate request.
 * Server boot never auto-migrates; deploy-time CLI commands remain the source
 * of truth for production upgrades.
 */
@Injectable()
export class ExtensionMigrationService {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,

    @Inject(EXTENSION_OPTIONS_TOKEN)
    private readonly options: ExtensionsModuleOptions,

    @Inject(EXTENSIONS_TOKEN)
    private readonly extensions: ValidatedExtension[],

    private readonly manager: ExtensionManager,
    private readonly registry: ExtensionContributionRegistry,
  ) {}

  /**
   * Provisions extensions marked `defaultEnabled` for a newly migrated tenant.
   *
   * Called after the tenant's core migrations; failures leave the tenant
   * uninitialized so provisioning can be retried.
   */
  async enableDefaults(organizationId: string): Promise<string[]> {
    const defaults = this.extensions.filter(
      (extension) => extension.manifest.defaultEnabled,
    );

    for (const extension of defaults) {
      await this.manager.ensureTenantRecord(
        extension.manifest.id,
        organizationId,
      );
      await this.migrate(extension.manifest.id, organizationId);
      await this.manager.enable(extension.manifest.id, organizationId);
    }

    return defaults.map((extension) => extension.manifest.id);
  }

  async migrate(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionMigrationResult> {
    const manifest = this.registry.getManifest(extensionId);

    if (!manifest) {
      throw new ExtensionNotFoundError(extensionId);
    }

    const extension = await this.manager.getExtension(extensionId);
    const existing = await this.manager.ensureTenantRecord(
      extensionId,
      organizationId,
    );
    const previousStatus =
      existing.status === 'enabled' ? 'enabled' : 'disabled';

    if (!manifest.migrations) {
      return {
        extensionId,
        organizationId,
        applied: [],
        skipped: true,
        reason: 'not-configured',
      };
    }

    const migrationsDirectory =
      this.options.migrationDirectories?.[extensionId];

    if (!migrationsDirectory) {
      throw new Error(
        `No migration directory is registered for extension "${extensionId}". Run "pnpm extensions:sync" and redeploy.`,
      );
    }

    await this.manager.markMigrating(extensionId, organizationId);

    try {
      const result = await runExtensionMigrations({
        knex: this.tenantKnex(),
        extensionId,
        organizationId,
        migrationsDirectory,
      });

      await this.manager.completeMigration(
        extensionId,
        organizationId,
        extension.version,
        previousStatus,
      );

      return result;
    } catch (error) {
      await this.manager.markMigrationFailed(
        extensionId,
        organizationId,
        error,
      );
      throw error;
    }
  }

  async getHealth(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionHealth> {
    const extension = await this.manager.getExtension(extensionId);
    const record = await this.manager.getTenantRecord(
      extensionId,
      organizationId,
    );
    const migrationTable = extensionMigrationTable(extensionId);
    const health: ExtensionHealth = {
      extensionId,
      installedVersion: extension.version,
      tenantVersion: record?.version,
      status: record?.status,
      enabled: await this.manager.isEnabled(extensionId, organizationId),
      lastError: record?.lastError,
      migrationTable,
    };

    try {
      const tableExists =
        await this.tenantKnex().schema.hasTable(migrationTable);

      if (tableExists) {
        const [summary] = (await this.tenantKnex()(migrationTable).select(
          this.tenantKnex().raw('COUNT(*) as count'),
          this.tenantKnex().raw('MAX(batch) as batch'),
        )) as unknown as Array<{
          count: number | string | null;
          batch: number | string | null;
        }>;

        health.appliedMigrations = Number(summary?.count ?? 0);
        health.latestBatch =
          summary?.batch === null || summary?.batch === undefined
            ? undefined
            : Number(summary.batch);
      }
    } catch {
      // Health should remain readable when the tenant database or migration
      // table is unavailable.
    }

    return health;
  }
}
