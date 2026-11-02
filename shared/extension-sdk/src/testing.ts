import type {
  ApprovalPolicy,
  PaymentProvider,
  ReportProvider,
  TaxProvider,
} from './bridges';
import type { ExtensionCapability } from './capabilities';
import type {
  ExtensionEventBus,
  ExtensionEventHandler,
  ExtensionEventSubscription,
  ExtensionEventSubscriptionOptions,
} from './events';
import { isExtensionEventName } from './events';
import {
  parseExtensionManifest,
  type AbilityDefinition,
  type ExtensionManifest,
  type FeatureDefinition,
  type SettingDefinition,
} from './manifest';
import type {
  ExtensionContext,
  ExtensionJobDefinition,
  ExtensionLogger,
} from './server';

export type TestLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TestLogEntry {
  level: TestLogLevel;
  message: string;
  error?: unknown;
  meta?: Record<string, unknown>;
}

export interface TestEventRecord {
  event: string;
  payload: unknown;
}

export interface ExtensionTestHarnessOptions {
  organizationId?: string;
  tenantId?: number;
  tenantDatabase?: unknown;
  config?: Record<string, unknown>;
  capabilities?: ExtensionCapability[];
}

export interface ExtensionTestHarness {
  readonly manifest: ExtensionManifest;
  readonly context: ExtensionContext;
  readonly emitted: TestEventRecord[];
  readonly logs: TestLogEntry[];
  readonly features: FeatureDefinition[];
  readonly abilities: AbilityDefinition[];
  readonly settings: SettingDefinition[];
  readonly jobs: ExtensionJobDefinition[];
  readonly bridges: {
    reports: ReportProvider[];
    approvals: ApprovalPolicy[];
    payments: PaymentProvider[];
    tax: TaxProvider[];
  };
  createContext(overrides?: Partial<ExtensionContext>): ExtensionContext;
  dispatch(event: string, payload: unknown): Promise<void>;
}

/**
 * Creates an in-memory host for testing an extension without booting Nest or a
 * database.
 *
 * The harness records registrations, emitted events, and logs so extension
 * authors can assert on contributions and side effects.
 */
export function createExtensionTestHarness(
  manifestInput: unknown,
  options: ExtensionTestHarnessOptions = {},
): ExtensionTestHarness {
  const manifest = parseExtensionManifest(manifestInput);

  const emitted: TestEventRecord[] = [];
  const logs: TestLogEntry[] = [];
  const features: FeatureDefinition[] = [];
  const abilities: AbilityDefinition[] = [];
  const settings: SettingDefinition[] = [];
  const jobs: ExtensionJobDefinition[] = [];
  const reports: ReportProvider[] = [];
  const approvals: ApprovalPolicy[] = [];
  const payments: PaymentProvider[] = [];
  const tax: TaxProvider[] = [];

  const handlers = new Map<string, Set<ExtensionEventHandler>>();

  let currentTenant = {
    organizationId: options.organizationId ?? 'test-organization',
    tenantId: options.tenantId,
  };

  const logger: ExtensionLogger = {
    debug(message, meta) {
      logs.push({ level: 'debug', message, meta });
    },
    info(message, meta) {
      logs.push({ level: 'info', message, meta });
    },
    warn(message, meta) {
      logs.push({ level: 'warn', message, meta });
    },
    error(message, error, meta) {
      logs.push({ level: 'error', message, error, meta });
    },
  };

  const createContext = (
    overrides: Partial<ExtensionContext> = {},
  ): ExtensionContext => {
    const grantedCapabilities = new Set<ExtensionCapability>(
      overrides.capabilities
        ? Array.from(overrides.capabilities)
        : (options.capabilities ?? manifest.capabilities),
    );

    const events: ExtensionEventBus = {
      on<T = unknown>(
        event: string,
        handler: ExtensionEventHandler<T>,
        _subscriptionOptions?: ExtensionEventSubscriptionOptions,
      ): ExtensionEventSubscription {
        const handlersForEvent =
          handlers.get(event) ?? new Set<ExtensionEventHandler>();

        handlersForEvent.add(handler as ExtensionEventHandler);
        handlers.set(event, handlersForEvent);

        return {
          dispose: () => {
            handlersForEvent.delete(handler as ExtensionEventHandler);

            if (handlersForEvent.size === 0) {
              handlers.delete(event);
            }
          },
        };
      },

      async emit<T = unknown>(event: string, payload: T): Promise<void> {
        if (!isExtensionEventName(event)) {
          throw new Error(
            `Extensions may only emit namespaced events ("ext:<id>:<event>"). Received "${event}".`,
          );
        }

        emitted.push({ event, payload });
        await dispatch(event, payload);
      },
    };

    const context: ExtensionContext = {
      id: manifest.id,
      version: manifest.version,
      trust: manifest.trust,
      capabilities: grantedCapabilities,
      logger,
      config: {
        get: <T = string>(key: string) =>
          (options.config?.[key] as T | undefined) ?? undefined,
        require: <T = string>(key: string) => {
          const value = options.config?.[key];

          if (value === undefined) {
            throw new Error(`Missing required extension config "${key}".`);
          }

          return value as T;
        },
        has: (key: string) => options.config?.[key] !== undefined,
      },
      features: {
        register: (definition) => {
          features.push(definition);
        },
      },
      abilities: {
        register: (definition) => {
          abilities.push(definition);
        },
      },
      settings: {
        register: (definition) => {
          settings.push(definition);
        },
      },
      events,
      jobs: {
        register: <TData = unknown>(
          definition: ExtensionJobDefinition<TData>,
        ) => {
          jobs.push(definition as ExtensionJobDefinition);
        },
      },
      bridges: {
        reports: {
          register: (provider) => {
            reports.push(provider);
          },
        },
        approvals: {
          register: (provider) => {
            approvals.push(provider);
          },
        },
        payments: {
          register: (provider) => {
            payments.push(provider);
          },
        },
        tax: {
          register: (provider) => {
            tax.push(provider);
          },
        },
      },
      tenancy: {
        current: () => currentTenant,
        async runAs<T>(
          organizationId: string,
          fn: () => Promise<T> | T,
        ): Promise<T> {
          const previousTenant = currentTenant;
          currentTenant = { ...previousTenant, organizationId };

          try {
            return await fn();
          } finally {
            currentTenant = previousTenant;
          }
        },
      },
      http: {
        basePath: `/api/ext/${manifest.id}`,
      },
      hasCapability: (capability) => grantedCapabilities.has(capability),
      ...(grantedCapabilities.has('tenant.db.read') ||
      grantedCapabilities.has('tenant.db.write')
        ? {
            db: {
              tenant: () => options.tenantDatabase,
            },
          }
        : {}),
      ...overrides,
    };

    return context;
  };

  const dispatch = async (event: string, payload: unknown): Promise<void> => {
    const handlersForEvent = handlers.get(event);

    if (!handlersForEvent) {
      return;
    }

    for (const handler of handlersForEvent) {
      await handler(payload);
    }
  };

  const context = createContext();

  return {
    manifest,
    context,
    emitted,
    logs,
    features,
    abilities,
    settings,
    jobs,
    bridges: { reports, approvals, payments, tax },
    createContext,
    dispatch,
  };
}
