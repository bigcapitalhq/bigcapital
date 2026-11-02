import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { CliError } from './errors';

const EXACT_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

/**
 * Resolves the deployment root.
 *
 * pnpm sets `INIT_CWD` to the directory where the command was invoked, which
 * is the repo/deployment root when using the root-level scripts.
 */
export function getRootDir(explicit?: string): string {
  return path.resolve(explicit ?? process.env.INIT_CWD ?? process.cwd());
}

export function assertRoot(rootDir: string): void {
  const packageJsonPath = path.join(rootDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new CliError(
      `Unable to find package.json at "${rootDir}". Run the command from the Bigcapital deployment root or pass --root.`,
    );
  }
}

export function readJsonFile<T>(filePath: string): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    throw new CliError(
      `Unable to read JSON file "${filePath}": ${(error as Error).message}`,
    );
  }
}

export function readOptionalJsonFile<T>(filePath: string): T | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return readJsonFile<T>(filePath);
}

export function readTextFileOrUndefined(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return fs.readFileSync(filePath, 'utf8');
}

export function writeJsonFile(filePath: string, value: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function writeTextFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Deterministic JSON serialization used for manifest hashes and lockfile
 * comparisons.
 */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();

    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

export function hashManifest(manifest: unknown): string {
  return `sha256:${crypto
    .createHash('sha256')
    .update(stableStringify(manifest))
    .digest('hex')}`;
}

export interface ParsedPackageSpec {
  packageName: string;
  version?: string;
}

/**
 * Parses `name`, `name@1.2.3`, `@scope/name`, or `@scope/name@1.2.3`.
 *
 * Tags, ranges and protocol specs are rejected: deploy-time installs must be
 * pinned to an exact installed version.
 */
export function parsePackageSpec(spec: string): ParsedPackageSpec {
  const value = spec.trim();

  if (!value) {
    throw new CliError('A package name is required.');
  }

  let packageName: string;
  let version: string | undefined;

  if (value.startsWith('@')) {
    const separator = value.indexOf('@', 1);

    if (separator === -1) {
      packageName = value;
    } else {
      packageName = value.slice(0, separator);
      version = value.slice(separator + 1);
    }
  } else {
    const separator = value.lastIndexOf('@');

    if (separator > 0) {
      packageName = value.slice(0, separator);
      version = value.slice(separator + 1);
    } else {
      packageName = value;
    }
  }

  if (!/^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i.test(packageName)) {
    throw new CliError(
      `Invalid package name "${packageName}". Use the installed npm package name.`,
    );
  }

  if (version !== undefined) {
    if (!EXACT_VERSION_PATTERN.test(version)) {
      throw new CliError(
        `Invalid extension version "${version}". Use an exact version such as 1.2.3.`,
      );
    }
  }

  return { packageName, version };
}

/**
 * Converts a package name to a unique, valid TypeScript identifier base.
 */
export function toIdentifier(packageName: string, suffix = ''): string {
  const withoutScope = packageName.replace(/^@[^/]+\//, '');
  const parts = withoutScope.split(/[^a-zA-Z0-9]+/).filter(Boolean);

  const base = parts
    .map((part, index) => {
      const normalized = part.replace(/[^a-zA-Z0-9]/g, '');

      if (index === 0) {
        return normalized.charAt(0).toLowerCase() + normalized.slice(1);
      }

      return (
        normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
      );
    })
    .join('');

  const safeBase = /^[a-zA-Z]/.test(base) ? base : `ext${base}`;

  return `${safeBase}${suffix}`;
}

export function createUniqueIdentifiers(
  packageNames: string[],
  suffix = '',
): Map<string, string> {
  const used = new Set<string>();
  const identifiers = new Map<string, string>();

  packageNames.forEach((packageName) => {
    const base = toIdentifier(packageName, suffix);
    let candidate = base;
    let counter = 2;

    while (used.has(candidate)) {
      candidate = `${base}${counter}`;
      counter += 1;
    }

    used.add(candidate);
    identifiers.set(packageName, candidate);
  });

  return identifiers;
}

export function formatList(items: string[]): string {
  return items.length > 0 ? items.join(', ') : '(none)';
}
