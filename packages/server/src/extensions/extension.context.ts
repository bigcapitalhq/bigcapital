import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import type { Knex } from 'knex';
import {
  isExtensionEventName,
  sanitizeExtensionId,
  type ExtensionEventHandler,
  type ExtensionEventSubscriptionOptions,
  type ExtensionManifest,
} from '@bigcapital/extension-sdk';
import type {
  ExtensionConfig,
  ExtensionContext,
  ExtensionLogger,
  PdfRegistryApi,
  ScopedMail,
  ScopedStorage,
  TenancyApi,
} from '@bigcapital/extension-sdk/server';
import { TENANCY_DB_CONNECTION } from '../modules/Tenancy/TenancyDB/TenancyDB.constants';
import { ExtensionBridgeRegistries } from './bridges';
import { ExtensionContributionRegistry } from './extension.registry';

export interface ExtensionContextAdapters {
  registry: ExtensionContributionRegistry;
  bridges: ExtensionBridgeRegistries;
  logger: ExtensionLogger;
  config: ExtensionConfig;
  emitEvent: (event: string, payload: unknown) => Promise<void>;
  tenancy: TenancyApi;
  db?: { tenant(): unknown };
  storage?: ScopedStorage;
  mail?: ScopedMail;
  pdf?: PdfRegistryApi;
}

/**
 * Builds the host surface exposed to an extension. Both the static
 * (module-definition time) and runtime contexts use this function so the API is
 * identical in both phases.
 */
export function buildExtensionContext(
  manifest: ExtensionManifest,
  adapters: ExtensionContextAdapters,
): ExtensionContext {
  const capabilities = new Set(manifest.capabilities);
  const { registry } = adapters;

  return {
    id: manifest.id,
    version: manifest.version,
    trust: manifest.trust,
    capabilities,
    logger: adapters.logger,
    config: adapters.config,
    features: {
      register: (definition) => {
        registry.registerFeature(manifest.id, definition);
      },
    },
    abilities: {
      register: (definition) => {
        registry.registerAbility(manifest.id, definition);
      },
    },
    settings: {
      register: (definition) => {
        registry.registerSetting(manifest.id, definition);
      },
    },
    events: {
      on: <T = unknown>(
        event: string,
        handler: ExtensionEventHandler<T>,
        options?: ExtensionEventSubscriptionOptions,
      ) => {
        const contribution = registry.registerEventSubscriber(
          manifest.id,
          event,
          handler as ExtensionEventHandler,
          options,
        );

        return {
          dispose: () => {
            registry.removeEventSubscriber(contribution.id);
          },
        };
      },

      emit: async <T = unknown>(event: string, payload: T) => {
        if (!isExtensionEventName(event)) {
          throw new Error(
            `Extensions may only emit namespaced events ("ext:<id>:<event>"). Received "${event}".`,
          );
        }

        await adapters.emitEvent(event, payload);
      },
    },
    jobs: {
      register: (definition) => {
        registry.registerJob(manifest.id, definition);
      },
    },
    bridges: {
      reports: {
        register: (provider) => {
          adapters.bridges.reports.register(manifest.id, provider);
        },
      },
      approvals: {
        register: (policy) => {
          adapters.bridges.approvals.register(manifest.id, policy);
        },
      },
      payments: {
        register: (provider) => {
          adapters.bridges.payments.register(manifest.id, provider);
        },
      },
      tax: {
        register: (provider) => {
          adapters.bridges.tax.register(manifest.id, provider);
        },
      },
    },
    storage: adapters.storage,
    mail: adapters.mail,
    pdf: adapters.pdf,
    db: adapters.db,
    tenancy: adapters.tenancy,
    http: {
      basePath: `/api/ext/${manifest.id}`,
    },
    hasCapability: (capability) => capabilities.has(capability),
  };
}

export function createExtensionLogger(extensionId: string): ExtensionLogger {
  const logger = new Logger(extensionId);

  return {
    debug: (message, meta) => logger.debug(message, meta),
    info: (message, meta) => logger.log(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    error: (message, error, meta) => {
      logger.error(
        message,
        error instanceof Error ? error.stack : (error as string | undefined),
        meta,
      );
    },
  };
}

/**
 * Reads extension configuration from environment variables namespaced by the
 * extension id:
 *
 *   EXT_ACME_REPORTS_API_KEY
 */
export function createExtensionConfig(extensionId: string): ExtensionConfig {
  const prefix = `EXT_${sanitizeExtensionId(extensionId).toUpperCase()}_`;

  const get = <T = string>(key: string): T | undefined => {
    const value = process.env[`${prefix}${key}`];

    return value as T | undefined;
  };

  return {
    get,
    require: <T = string>(key: string): T => {
      const value = get<T>(key);

      if (value === undefined) {
        throw new Error(`Missing required extension config "${prefix}${key}".`);
      }

      return value;
    },
    has: (key: string) => get(key) !== undefined,
  };
}

/**
 * Context used while the host is building the module graph.
 *
 * Runtime-only services (events, tenancy, tenant DB) are not available yet and
 * fail with a descriptive error if an extension tries to use them during
 * `createModule`.
 */
export class StaticExtensionContextFactory {
  constructor(
    private readonly registry: ExtensionContributionRegistry,
    private readonly bridges: ExtensionBridgeRegistries,
  ) {}

  create(manifest: ExtensionManifest): ExtensionContext {
    const hasTenantDb =
      manifest.capabilities.includes('tenant.db.read') ||
      manifest.capabilities.includes('tenant.db.write');

    return buildExtensionContext(manifest, {
      registry: this.registry,
      bridges: this.bridges,
      logger: createExtensionLogger(manifest.id),
      config: createExtensionConfig(manifest.id),
      emitEvent: async () => {
        throw new Error(
          `Extension "${manifest.id}" cannot emit events during module creation. Register runtime behavior in a provider instead.`,
        );
      },
      tenancy: {
        current: () => {
          throw new Error(
            `Extension "${manifest.id}" has no tenant context during module creation.`,
          );
        },
        runAs: async () => {
          throw new Error(
            `Extension "${manifest.id}" cannot run tenant-scoped work during module creation.`,
          );
        },
      },
      db: hasTenantDb
        ? {
            tenant: () => {
              throw new Error(
                `Extension "${manifest.id}" cannot access the tenant database during module creation.`,
              );
            },
          }
        : undefined,
    });
  }
}

/**
 * Runtime context factory used for lifecycle hooks.
 */
@Injectable()
export class ExtensionContextFactory {
  constructor(
    private readonly registry: ExtensionContributionRegistry,

    @Inject(ExtensionBridgeRegistries)
    private readonly bridges: ExtensionBridgeRegistries,

    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,

    @Optional()
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex?: () => Knex,
  ) {}

  create(manifest: ExtensionManifest): ExtensionContext {
    const hasTenantDb =
      manifest.capabilities.includes('tenant.db.read') ||
      manifest.capabilities.includes('tenant.db.write');

    return buildExtensionContext(manifest, {
      registry: this.registry,
      bridges: this.bridges,
      logger: createExtensionLogger(manifest.id),
      config: createExtensionConfig(manifest.id),
      emitEvent: async (event, payload) => {
        await this.eventEmitter.emitAsync(event, payload);
      },
      tenancy: {
        current: () => {
          const organizationId = this.cls.get<string>('organizationId');

          if (!organizationId) {
            throw new Error('No tenant context is available.');
          }

          return { organizationId };
        },
        runAs: async (organizationId, fn) => {
          const previous = this.cls.get<string>('organizationId');
          this.cls.set('organizationId', organizationId);

          try {
            return await fn();
          } finally {
            this.cls.set('organizationId', previous);
          }
        },
      },
      db:
        hasTenantDb && this.tenantKnex
          ? {
              tenant: () => this.tenantKnex!(),
            }
          : undefined,
    });
  }
}
