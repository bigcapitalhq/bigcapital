import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';
import { assertValidExtensionId } from './namespaces';
import type { ExtensionCapability } from './capabilities';
import type { ExtensionEventBus } from './events';
import {
  parseExtensionManifest,
  type AbilityDefinition,
  type ExtensionManifest,
  type ExtensionManifestInput,
  type ExtensionTrust,
  type FeatureDefinition,
  type SettingDefinition,
} from './manifest';

export type { ExtensionTrust } from './manifest';

export interface ExtensionLogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: unknown, meta?: Record<string, unknown>): void;
}

export interface ExtensionConfig {
  get<T = string>(key: string): T | undefined;
  require<T = string>(key: string): T;
  has(key: string): boolean;
}

export interface ExtensionTenant {
  organizationId: string;
  tenantId?: number;
}

export interface TenancyApi {
  current(): ExtensionTenant;
  runAs<T>(organizationId: string, fn: () => Promise<T> | T): Promise<T>;
}

/**
 * Minimal, framework-agnostic description of a NestJS dynamic module.
 *
 * The host casts this to Nest's `DynamicModule`. Keeping the SDK free of a
 * `@nestjs/common` dependency lets web and CLI consumers use the same package.
 */
export interface ExtensionModuleDefinition {
  module: unknown;
  imports?: unknown[];
  providers?: unknown[];
  controllers?: unknown[];
  exports?: unknown[];
  global?: boolean;
}

export interface FeatureRegistryApi {
  register(definition: FeatureDefinition): void;
}

export interface AbilityRegistryApi {
  register(definition: AbilityDefinition): void;
}

export interface SettingsRegistryApi {
  register(definition: SettingDefinition): void;
}

export interface ExtensionJobContext<TData = unknown> {
  id?: string;
  name: string;
  data: TData;
  organizationId?: string;
}

export interface ExtensionJobDefinition<TData = unknown> {
  name: string;
  handler: (job: ExtensionJobContext<TData>) => Promise<void> | void;
  options?: Record<string, unknown>;
}

export interface JobRegistryApi {
  register<TData = unknown>(definition: ExtensionJobDefinition<TData>): void;
}

export interface ScopedStorage {
  put(
    key: string,
    data: Uint8Array | string,
    options?: { contentType?: string },
  ): Promise<{ key: string; url?: string }>;
  get(key: string): Promise<Uint8Array>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

export interface ScopedMail {
  send(input: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<void>;
}

export interface PdfTemplateRegistration {
  id: string;
  name: string;
  template: string;
}

export interface PdfRegistryApi {
  register(registration: PdfTemplateRegistration): void;
}

/**
 * The only host surface available to an extension.
 *
 * Optional services (`db`, `storage`, `mail`, `pdf`) are present only when the
 * extension declared and was granted the corresponding capability.
 */
export interface ExtensionContext<TTenantDatabase = unknown> {
  readonly id: string;
  readonly version: string;
  readonly trust: ExtensionTrust;
  readonly capabilities: ReadonlySet<ExtensionCapability>;
  readonly logger: ExtensionLogger;
  readonly config: ExtensionConfig;
  readonly features: FeatureRegistryApi;
  readonly abilities: AbilityRegistryApi;
  readonly settings: SettingsRegistryApi;
  readonly events: ExtensionEventBus;
  readonly jobs: JobRegistryApi;
  readonly storage?: ScopedStorage;
  readonly mail?: ScopedMail;
  readonly pdf?: PdfRegistryApi;
  readonly db?: {
    tenant(): TTenantDatabase;
  };
  readonly tenancy: TenancyApi;
  readonly http: {
    basePath: string;
  };
  hasCapability(capability: ExtensionCapability): boolean;
}

/**
 * A native, in-process extension.
 *
 * `createModule` returns the Nest module that owns the extension's controllers,
 * providers, and subscribers. The host mounts it after validating the manifest
 * and capability set.
 */
export interface BigcapitalExtension<TTenantDatabase = unknown> {
  readonly manifest: ExtensionManifest;
  createModule(
    ctx: ExtensionContext<TTenantDatabase>,
  ): ExtensionModuleDefinition | Promise<ExtensionModuleDefinition>;
  onEnable?(ctx: ExtensionContext<TTenantDatabase>): Promise<void>;
  onDisable?(ctx: ExtensionContext<TTenantDatabase>): Promise<void>;
  onUpgrade?(
    ctx: ExtensionContext<TTenantDatabase>,
    fromVersion: string,
  ): Promise<void>;
}

export interface ServerExtensionDefinition<TTenantDatabase = unknown>
  extends Omit<BigcapitalExtension<TTenantDatabase>, 'manifest'> {
  /**
   * Partial manifest accepted from the extension author. Defaults are applied
   * and the result is validated by the host.
   */
  manifest: ExtensionManifestInput;
}

/**
 * Defines a native extension and normalizes its manifest.
 *
 * Use this helper in the extension entry point:
 *
 * ```ts
 * export const extension = defineServerExtension({
 *   manifest: { id: 'acme.reports', name: 'Acme Reports', version: '1.0.0', trust: 'partner' },
 *   createModule: () => ({ module: ReportsModule }),
 * });
 * ```
 */
export function defineServerExtension<TTenantDatabase = unknown>(
  definition: ServerExtensionDefinition<TTenantDatabase>,
): BigcapitalExtension<TTenantDatabase> {
  return {
    ...definition,
    manifest: parseExtensionManifest(definition.manifest),
  };
}

export const REQUIRE_FEATURE_KEY = 'extension:require-feature';

/**
 * Requires the given feature to be accessible for the current tenant.
 *
 * Feature keys owned by extensions use the `ext:<extensionId>:<key>` format.
 * The host applies the feature guard globally, so controllers only need this
 * metadata.
 *
 * @example
 * ```ts
 * @RequireFeature('ext:acme.reports:advanced')
 * @Get('reports')
 * ```
 */
export function RequireFeature(
  feature: string,
): MethodDecorator & ClassDecorator {
  return SetMetadata(REQUIRE_FEATURE_KEY, feature);
}

export const EXTENSION_CONTROLLER_METADATA_KEY =
  'bigcapital:extension-controller';

export interface ExtensionControllerMetadata {
  extensionId: string;
}

/**
 * Declares a controller mounted under `/api/ext/<extensionId>`.
 *
 * Extension controllers must use this decorator instead of `@Controller`.
 * The host validates these controllers at bootstrap and rejects any route that
 * escapes the extension namespace.
 *
 * @example
 * ```ts
 * @ExtensionController('acme.reports', 'reports')
 * export class ReportsController {}
 * ```
 */
export function ExtensionController(
  extensionId: string,
  path = '',
): ClassDecorator {
  assertValidExtensionId(extensionId);

  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  const controllerPath = normalizedPath
    ? `ext/${extensionId}/${normalizedPath}`
    : `ext/${extensionId}`;

  return applyDecorators(
    Controller(controllerPath),
    SetMetadata(EXTENSION_CONTROLLER_METADATA_KEY, {
      extensionId,
    } as ExtensionControllerMetadata),
  );
}
