import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { events } from '@/common/events/events';
import { Extension } from '../modules/System/models/Extension.model';
import { ExtensionTenant } from '../modules/System/models/ExtensionTenant.model';
import {
  EXTENSION_ENABLEMENT_CACHE_MAX_ENTRIES,
  EXTENSION_ENABLEMENT_CACHE_TTL_MS,
  EXTENSION_OPTIONS_TOKEN,
  EXTENSIONS_TOKEN,
} from './extension.constants';
import {
  ExtensionNotFoundError,
  ExtensionTenantNotFoundError,
} from './extension.errors';
import type {
  ExtensionTenantView,
  ExtensionsModuleOptions,
  ValidatedExtension,
} from './extension.types';

interface EnablementCacheEntry {
  enabled: boolean;
  expiresAt: number;
}

/**
 * Owns the system-side extension catalog and per-tenant enablement.
 */
@Injectable()
export class ExtensionManager {
  private readonly enablementCache = new Map<string, EnablementCacheEntry>();
  private readonly cacheTtlMs: number;
  private readonly cacheMaxEntries: number;

  constructor(
    @Inject(Extension.name)
    private readonly extensionModel: typeof Extension,

    @Inject(ExtensionTenant.name)
    private readonly extensionTenantModel: typeof ExtensionTenant,

    private readonly eventEmitter: EventEmitter2,

    @Inject(EXTENSIONS_TOKEN)
    private readonly extensions: ValidatedExtension[],

    @Inject(EXTENSION_OPTIONS_TOKEN)
    private readonly options: ExtensionsModuleOptions,
  ) {
    this.cacheTtlMs =
      options.enablementCacheTtlMs ?? EXTENSION_ENABLEMENT_CACHE_TTL_MS;
    this.cacheMaxEntries =
      options.enablementCacheMaxEntries ??
      EXTENSION_ENABLEMENT_CACHE_MAX_ENTRIES;
  }

  /**
   * Upserts the compiled extension manifests into the system catalog.
   *
   * The compiled list is the source of truth at deploy time. This method does
   * not remove extensions that are no longer present; uninstall is an explicit
   * operator action.
   */
  async syncCatalog(): Promise<void> {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    for (const extension of this.extensions) {
      const { manifest } = extension;
      const manifestRecord = manifest as unknown as Record<string, unknown>;

      const existing = await this.extensionModel
        .query()
        .findOne({ extensionId: manifest.id });

      const catalogPayload = {
        name: manifest.name,
        version: manifest.version,
        manifest: manifestRecord,
        trust: manifest.trust,
      };

      if (existing) {
        // Preserve an operator-controlled global status (e.g. the kill switch).
        await this.extensionModel
          .query()
          .findById(existing.id)
          .patch({ ...catalogPayload, updatedAt: now });
      } else {
        try {
          await this.extensionModel.query().insert({
            extensionId: manifest.id,
            ...catalogPayload,
            status: 'active',
            installedAt: now,
          });
        } catch (error) {
          // Multiple instances may boot at the same time. If another instance
          // won the insert race, update the row it created.
          if (!isDuplicateEntryError(error)) {
            throw error;
          }

          const raced = await this.extensionModel
            .query()
            .findOne({ extensionId: manifest.id });

          if (!raced) {
            throw error;
          }

          await this.extensionModel
            .query()
            .findById(raced.id)
            .patch({ ...catalogPayload, updatedAt: now });
        }
      }
    }

    await this.eventEmitter.emitAsync(events.extensions.onCatalogSynced, {
      extensionIds: this.extensions.map((extension) => extension.manifest.id),
    });
  }

  /**
   * Returns the installed extensions merged with the tenant's enablement state.
   */
  async listForOrganization(
    organizationId?: string,
  ): Promise<ExtensionTenantView[]> {
    const extensions = await this.extensionModel.query().orderBy('name');

    const tenantRecords = organizationId
      ? await this.extensionTenantModel.query().where({ organizationId })
      : [];

    const tenantByExtensionId = new Map(
      tenantRecords.map((record) => [record.extensionId, record]),
    );

    return extensions.map((extension) => {
      const tenant = tenantByExtensionId.get(extension.extensionId);

      return {
        id: extension.extensionId,
        name: extension.name,
        version: extension.version,
        trust: extension.trust,
        status: extension.status,
        enabled: tenant?.status === 'enabled',
        tenantStatus: tenant?.status,
        settings: tenant?.settings,
      };
    });
  }

  async getExtension(extensionId: string): Promise<Extension> {
    const extension = await this.extensionModel
      .query()
      .findOne({ extensionId });

    if (!extension) {
      throw new ExtensionNotFoundError(extensionId);
    }

    return extension;
  }

  async getTenantRecord(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionTenant | undefined> {
    return this.extensionTenantModel
      .query()
      .findOne({ extensionId, organizationId });
  }

  /**
   * Enables an extension for a single organization.
   */
  async enable(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionTenant> {
    const extension = await this.getExtension(extensionId);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    const existing = await this.getTenantRecord(extensionId, organizationId);

    const enablePayload = {
      status: 'enabled' as const,
      version: extension.version,
      enabledAt: now,
      disabledAt: null,
      lastError: null,
    };

    if (existing) {
      await this.extensionTenantModel
        .query()
        .findById(existing.id)
        .patch(enablePayload);
    } else {
      try {
        await this.extensionTenantModel.query().insert({
          extensionId,
          organizationId,
          version: extension.version,
          status: 'enabled',
          enabledAt: now,
        });
      } catch (error) {
        // Another request may have enabled the extension concurrently.
        if (!isDuplicateEntryError(error)) {
          throw error;
        }

        const raced = await this.getTenantRecord(extensionId, organizationId);

        if (!raced) {
          throw error;
        }

        await this.extensionTenantModel
          .query()
          .findById(raced.id)
          .patch(enablePayload);
      }
    }

    this.invalidate(extensionId, organizationId);

    await this.eventEmitter.emitAsync(events.extensions.onEnabled, {
      extensionId,
      organizationId,
    });

    return this.getTenantRecordOrThrow(extensionId, organizationId);
  }

  /**
   * Disables an extension for a single organization while retaining its data.
   */
  async disable(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionTenant> {
    const existing = await this.getTenantRecord(extensionId, organizationId);

    if (!existing) {
      throw new ExtensionTenantNotFoundError(extensionId, organizationId);
    }

    await this.extensionTenantModel
      .query()
      .findById(existing.id)
      .patch({
        status: 'disabled',
        disabledAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

    this.invalidate(extensionId, organizationId);

    await this.eventEmitter.emitAsync(events.extensions.onDisabled, {
      extensionId,
      organizationId,
    });

    return this.getTenantRecordOrThrow(extensionId, organizationId);
  }

  /**
   * Ensures a tenant row exists without changing enablement.
   *
   * Used before the first migration/enable so the tenant can carry migration
   * status and errors even when it starts from a disabled state.
   */
  async ensureTenantRecord(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionTenant> {
    const extension = await this.getExtension(extensionId);
    const existing = await this.getTenantRecord(extensionId, organizationId);

    if (existing) {
      return existing;
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      await this.extensionTenantModel.query().insert({
        extensionId,
        organizationId,
        version: extension.version,
        status: 'disabled',
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      if (!isDuplicateEntryError(error)) {
        throw error;
      }
    }

    return this.getTenantRecordOrThrow(extensionId, organizationId);
  }

  /**
   * Replaces the stored settings for a tenant extension.
   */
  async updateSettings(
    extensionId: string,
    organizationId: string,
    settings: Record<string, unknown>,
  ): Promise<ExtensionTenant> {
    const existing = await this.getTenantRecordOrThrow(
      extensionId,
      organizationId,
    );

    await this.extensionTenantModel
      .query()
      .findById(existing.id)
      .patch({ settings });

    this.invalidate(extensionId, organizationId);

    return this.getTenantRecordOrThrow(extensionId, organizationId);
  }

  /**
   * Records that a tenant migration is in progress.
   */
  async markMigrating(
    extensionId: string,
    organizationId: string,
  ): Promise<void> {
    const existing = await this.getTenantRecordOrThrow(
      extensionId,
      organizationId,
    );

    await this.extensionTenantModel
      .query()
      .findById(existing.id)
      .patch({ status: 'migrating', lastError: null });
  }

  /**
   * Records a successful migration and the version the tenant is now on.
   */
  async completeMigration(
    extensionId: string,
    organizationId: string,
    version: string,
    status: 'enabled' | 'disabled',
  ): Promise<void> {
    const existing = await this.getTenantRecordOrThrow(
      extensionId,
      organizationId,
    );

    await this.extensionTenantModel
      .query()
      .findById(existing.id)
      .patch({ version, status, lastError: null });

    this.invalidate(extensionId, organizationId);
  }

  /**
   * Records a migration failure and disables the extension until it is fixed.
   */
  async markMigrationFailed(
    extensionId: string,
    organizationId: string,
    error: unknown,
  ): Promise<void> {
    const existing = await this.getTenantRecordOrThrow(
      extensionId,
      organizationId,
    );

    await this.extensionTenantModel
      .query()
      .findById(existing.id)
      .patch({
        status: 'failed',
        lastError: error instanceof Error ? error.message : String(error),
      });

    this.invalidate(extensionId, organizationId);
  }

  /**
   * Determines whether an extension is enabled for the given organization.
   *
   * Results are cached briefly because this runs on every extension HTTP
   * request and event handler.
   */
  async isEnabled(
    extensionId: string,
    organizationId?: string,
  ): Promise<boolean> {
    if (!organizationId) {
      return false;
    }

    const cacheKey = this.cacheKey(extensionId, organizationId);
    const cached = this.enablementCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.enabled;
    }

    const extension = await this.extensionModel
      .query()
      .findOne({ extensionId });

    // Respect the global catalog status (operator kill switch) before checking
    // tenant enablement.
    const record =
      extension?.status === 'active'
        ? await this.extensionTenantModel
            .query()
            .findOne({ extensionId, organizationId, status: 'enabled' })
        : undefined;

    const enabled = Boolean(record);

    this.setCachedEnablement(cacheKey, {
      enabled,
      expiresAt: Date.now() + this.cacheTtlMs,
    });

    return enabled;
  }

  invalidate(extensionId: string, organizationId: string): void {
    this.enablementCache.delete(this.cacheKey(extensionId, organizationId));
  }

  clearCache(): void {
    this.enablementCache.clear();
  }

  private async getTenantRecordOrThrow(
    extensionId: string,
    organizationId: string,
  ): Promise<ExtensionTenant> {
    const record = await this.getTenantRecord(extensionId, organizationId);

    if (!record) {
      throw new ExtensionTenantNotFoundError(extensionId, organizationId);
    }

    return record;
  }

  private cacheKey(extensionId: string, organizationId: string): string {
    return `${organizationId}:${extensionId}`;
  }

  private setCachedEnablement(key: string, entry: EnablementCacheEntry): void {
    if (
      this.enablementCache.size >= this.cacheMaxEntries &&
      !this.enablementCache.has(key)
    ) {
      const oldestKey = this.enablementCache.keys().next().value;

      if (oldestKey !== undefined) {
        this.enablementCache.delete(oldestKey);
      }
    }

    this.enablementCache.set(key, entry);
  }
}

function isDuplicateEntryError(error: unknown): boolean {
  const candidate = error as { code?: string; errno?: number };

  return candidate?.code === 'ER_DUP_ENTRY' || candidate?.errno === 1062;
}
