export * from './capabilities';
export * from './constants';
export * from './events';
export * from './namespaces';
export * from './registry';

export type {
  AbilityDefinition,
  ExtensionManifest,
  ExtensionManifestInput,
  ExtensionTrust,
  FeatureDefinition,
  SettingDefinition,
} from './manifest';

// Server and web contracts live in their own entry points so that the root
// entry stays framework-agnostic:
//
//   import type { BigcapitalExtension } from '@bigcapital/extension-sdk/server';
//   import type { BigcapitalWebExtension } from '@bigcapital/extension-sdk/web';
