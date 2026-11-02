import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  assertExtensionCompatibility,
  parseExtensionManifest,
} from '@bigcapital/extension-sdk/manifest';
import type { ExtensionManifest } from '@bigcapital/extension-sdk';
import { CliError } from './errors';
import type {
  ExtensionLockEntry,
  ExtensionLockfile,
  PackageJson,
  ResolvedExtension,
} from './types';
import {
  hashManifest,
  parsePackageSpec,
  readJsonFile,
  readOptionalJsonFile,
} from './utils';

interface ResolvedPackage {
  packageDir: string;
  packageJsonPath: string;
  packageJson: PackageJson;
}

export function resolvePackage(
  rootDir: string,
  packageName: string,
): ResolvedPackage {
  const requireFromRoot = createRequire(path.join(rootDir, 'package.json'));

  let packageJsonPath: string | undefined;

  try {
    packageJsonPath = requireFromRoot.resolve(`${packageName}/package.json`);
  } catch {
    const candidates = [
      packageName,
      `${packageName}/server`,
      `${packageName}/web`,
    ];

    for (const candidate of candidates) {
      try {
        const entryPath = requireFromRoot.resolve(candidate);
        packageJsonPath = findPackageJsonPath(entryPath, packageName);
        break;
      } catch {
        // Try the next candidate.
      }
    }
  }

  if (!packageJsonPath) {
    throw new CliError(
      `Unable to resolve package "${packageName}". Install it in the deployment root first (for example: pnpm add ${packageName}).`,
    );
  }

  const packageDir = path.dirname(packageJsonPath);
  const packageJson = readJsonFile<PackageJson>(packageJsonPath);

  if (packageJson.name !== packageName) {
    throw new CliError(
      `Resolved "${packageName}" to a package named "${packageJson.name}". Check the installed package.`,
    );
  }

  if (typeof packageJson.version !== 'string') {
    throw new CliError(
      `Package "${packageName}" does not declare a valid version.`,
    );
  }

  return { packageDir, packageJsonPath, packageJson };
}

function findPackageJsonPath(entryPath: string, packageName: string): string {
  let currentDir = path.dirname(entryPath);
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const candidate = path.join(currentDir, 'package.json');

    if (fs.existsSync(candidate)) {
      const packageJson = readJsonFile<PackageJson>(candidate);

      if (packageJson.name === packageName) {
        return candidate;
      }
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  throw new CliError(`Unable to locate the package root for "${packageName}".`);
}

export function readExtensionManifest(
  packageDir: string,
  packageJson: PackageJson,
): ExtensionManifest {
  const source =
    packageJson.bigcapital ??
    readOptionalJsonFile(path.join(packageDir, 'bigcapital.extension.json'));

  if (!source) {
    throw new CliError(
      `Package "${packageJson.name}" does not declare a Bigcapital manifest. Add a "bigcapital" field to package.json or a bigcapital.extension.json file.`,
    );
  }

  let manifest: ExtensionManifest;

  try {
    manifest = parseExtensionManifest(source);
  } catch (error) {
    throw new CliError(
      `Invalid extension manifest for "${packageJson.name}".`,
      [(error as Error).message],
    );
  }

  if (manifest.version !== packageJson.version) {
    throw new CliError(
      `Manifest version "${manifest.version}" does not match package version "${packageJson.version}" for "${packageJson.name}".`,
    );
  }

  try {
    assertExtensionCompatibility(manifest);
  } catch (error) {
    throw new CliError((error as Error).message);
  }

  return manifest;
}

export function resolveExtensionSpec(
  rootDir: string,
  spec: string,
): ResolvedExtension {
  const { packageName, version } = parsePackageSpec(spec);

  return resolveExtensionByPackage(rootDir, packageName, version);
}

export function resolveExtensionEntry(
  rootDir: string,
  entry: ExtensionLockEntry,
): ResolvedExtension {
  const resolved = resolveExtensionByPackage(
    rootDir,
    entry.package,
    entry.version,
  );

  if (resolved.manifest.id !== entry.id) {
    throw new CliError(
      `Lockfile id "${entry.id}" does not match installed manifest id "${resolved.manifest.id}" for "${entry.package}".`,
    );
  }

  return { ...resolved, entry };
}

export function resolveLockfileExtensions(
  rootDir: string,
  lockfile: ExtensionLockfile,
): ResolvedExtension[] {
  return lockfile.extensions.map((entry) =>
    resolveExtensionEntry(rootDir, entry),
  );
}

export function createLockEntry(
  resolved: ResolvedExtension,
): ExtensionLockEntry {
  return {
    id: resolved.manifest.id,
    package: resolved.packageName,
    version: resolved.packageVersion,
    manifestHash: hashManifest(resolved.manifest),
    capabilities: [...resolved.manifest.capabilities].sort(),
    enabledByDefault: resolved.manifest.defaultEnabled,
  };
}

function resolveExtensionByPackage(
  rootDir: string,
  packageName: string,
  requestedVersion?: string,
): ResolvedExtension {
  const { packageDir, packageJson } = resolvePackage(rootDir, packageName);

  if (requestedVersion && packageJson.version !== requestedVersion) {
    throw new CliError(
      `Installed version of "${packageName}" is "${packageJson.version}", not "${requestedVersion}". Install the exact version first.`,
    );
  }

  const manifest = readExtensionManifest(packageDir, packageJson);
  const hasServer = Boolean(manifest.server);
  const hasWeb = Boolean(manifest.web);

  if (manifest.server) {
    assertEntryFile(packageDir, manifest.server.entry, 'server', packageName);
    assertSubpathExport(packageJson, 'server', packageName);
  }

  if (manifest.web) {
    assertEntryFile(packageDir, manifest.web.entry, 'web', packageName);
    assertSubpathExport(packageJson, 'web', packageName);
  }

  if (manifest.migrations) {
    const migrationsDir = path.resolve(packageDir, manifest.migrations);

    if (!fs.existsSync(migrationsDir)) {
      throw new CliError(
        `Migrations directory "${manifest.migrations}" not found in "${packageName}".`,
      );
    }
  }

  return {
    packageName,
    packageVersion: packageJson.version,
    packageDir,
    packageJson,
    manifest,
    hasServer,
    hasWeb,
  };
}

function assertEntryFile(
  packageDir: string,
  entry: string,
  kind: 'server' | 'web',
  packageName: string,
): void {
  const entryPath = path.resolve(packageDir, entry);

  if (!fs.existsSync(entryPath)) {
    throw new CliError(
      `The ${kind} entry "${entry}" does not exist in "${packageName}" (resolved to "${entryPath}").`,
    );
  }
}

/**
 * The generated imports use `<package>/server` and `<package>/web`. Packages
 * with an `exports` map must expose those subpaths.
 */
function assertSubpathExport(
  packageJson: PackageJson,
  subpath: 'server' | 'web',
  packageName: string,
): void {
  const exportsField = packageJson.exports;

  if (exportsField === undefined) {
    return;
  }

  if (typeof exportsField === 'string' || Array.isArray(exportsField)) {
    throw new CliError(
      `Package "${packageName}" must export "./${subpath}". Add it to the package.json "exports" map.`,
    );
  }

  if (exportsField && typeof exportsField === 'object') {
    const keys = Object.keys(exportsField as Record<string, unknown>);
    const hasSubpaths = keys.some((key) => key.startsWith('./'));

    if (!hasSubpaths || !keys.includes(`./${subpath}`)) {
      throw new CliError(
        `Package "${packageName}" must export "./${subpath}". Add it to the package.json "exports" map.`,
      );
    }
  }
}
