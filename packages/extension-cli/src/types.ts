import type { ExtensionManifest } from '@bigcapital/extension-sdk';

export interface ExtensionLockEntry {
  id: string;
  package: string;
  version: string;
  manifestHash: string;
  capabilities: string[];
  enabledByDefault: boolean;
}

export interface ExtensionLockfile {
  extensions: ExtensionLockEntry[];
}

export interface PackageJson {
  name: string;
  version: string;
  main?: string;
  exports?: unknown;
  bigcapital?: unknown;
  [key: string]: unknown;
}

export interface ResolvedExtension {
  entry?: ExtensionLockEntry;
  packageName: string;
  packageVersion: string;
  packageDir: string;
  packageJson: PackageJson;
  manifest: ExtensionManifest;
  hasServer: boolean;
  hasWeb: boolean;
}

export interface RootOptions {
  root?: string;
}
