import type {
  AbilityDefinition,
  ExtensionCapability,
  ExtensionEventHandler,
  ExtensionEventSubscriptionOptions,
  ExtensionManifest,
  FeatureDefinition,
  SettingDefinition,
} from '@bigcapital/extension-sdk';
import type {
  BigcapitalExtension,
  ExtensionJobDefinition,
} from '@bigcapital/extension-sdk/server';

/**
 * An extension whose manifest has been parsed, defaulted, and validated.
 */
export type ValidatedExtension<TTenantDatabase = unknown> =
  BigcapitalExtension<TTenantDatabase> & {
    manifest: ExtensionManifest;
  };

export interface ExtensionsModuleOptions {
  /**
   * Extensions compiled into the deployment. PR-7 will generate this list.
   */
  extensions?: BigcapitalExtension[];

  /**
   * Overrides the tenant enablement cache TTL.
   */
  enablementCacheTtlMs?: number;

  /**
   * Overrides the maximum number of cached tenant enablement entries.
   */
  enablementCacheMaxEntries?: number;

  /**
   * Overrides the default extension event handler timeout.
   */
  eventTimeoutMs?: number;
}

export interface FeatureContribution {
  id: string;
  owner: string;
  key: string;
  definition: FeatureDefinition;
}

export interface AbilityContribution {
  id: string;
  owner: string;
  subject: string;
  definition: AbilityDefinition;
}

export interface SettingContribution {
  id: string;
  owner: string;
  key: string;
  definition: SettingDefinition;
}

export interface EventSubscriberContribution {
  id: string;
  owner: string;
  event: string;
  handler: ExtensionEventHandler;
  options?: ExtensionEventSubscriptionOptions;
}

export interface JobContribution {
  id: string;
  owner: string;
  name: string;
  definition: ExtensionJobDefinition;
}

/**
 * Catalog of extension capabilities available to a single extension.
 */
export type ExtensionCapabilitySet = ReadonlySet<ExtensionCapability>;

/**
 * Merged view of an installed extension and its current tenant state.
 */
export interface ExtensionTenantView {
  id: string;
  name: string;
  version: string;
  trust: string;
  status: string;
  enabled: boolean;
  tenantStatus?: string;
  settings?: Record<string, unknown>;
}
