import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { CliError } from './errors';
import type { ExtensionLockEntry, ExtensionLockfile } from './types';
import { readJsonFile, writeJsonFile } from './utils';

export const LOCKFILE_NAME = 'bigcapital.extensions.json';

const lockEntrySchema = z.object({
  id: z.string().min(1),
  package: z.string().min(1),
  version: z.string().min(1),
  manifestHash: z.string().min(1),
  capabilities: z.array(z.string()).default([]),
  enabledByDefault: z.boolean().default(false),
});

const lockfileSchema = z.object({
  extensions: z.array(lockEntrySchema).default([]),
});

export function getLockfilePath(rootDir: string): string {
  return path.join(rootDir, LOCKFILE_NAME);
}

export function readLockfile(rootDir: string): ExtensionLockfile {
  const filePath = getLockfilePath(rootDir);

  if (!fs.existsSync(filePath)) {
    return { extensions: [] };
  }

  const raw = readJsonFile<unknown>(filePath);
  const result = lockfileSchema.safeParse(raw);

  if (!result.success) {
    throw new CliError(
      `Invalid ${LOCKFILE_NAME}.`,
      result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      ),
    );
  }

  const ids = new Set<string>();
  const packages = new Set<string>();

  for (const entry of result.data.extensions) {
    if (ids.has(entry.id)) {
      throw new CliError(
        `Duplicate extension id "${entry.id}" in ${LOCKFILE_NAME}.`,
      );
    }

    if (packages.has(entry.package)) {
      throw new CliError(
        `Duplicate extension package "${entry.package}" in ${LOCKFILE_NAME}.`,
      );
    }

    ids.add(entry.id);
    packages.add(entry.package);
  }

  return result.data;
}

export function writeLockfile(
  rootDir: string,
  lockfile: ExtensionLockfile,
): void {
  writeJsonFile(getLockfilePath(rootDir), sortLockfile(lockfile));
}

export function sortLockfile(lockfile: ExtensionLockfile): ExtensionLockfile {
  return {
    extensions: [...lockfile.extensions].sort((a, b) =>
      a.id.localeCompare(b.id),
    ),
  };
}

export function upsertLockEntry(
  lockfile: ExtensionLockfile,
  entry: ExtensionLockEntry,
): ExtensionLockfile {
  return {
    extensions: [
      ...lockfile.extensions.filter(
        (current) =>
          current.id !== entry.id && current.package !== entry.package,
      ),
      entry,
    ].sort((a, b) => a.id.localeCompare(b.id)),
  };
}

export function removeLockEntry(
  lockfile: ExtensionLockfile,
  idOrPackage: string,
): { lockfile: ExtensionLockfile; removed?: ExtensionLockEntry } {
  const removed = lockfile.extensions.find(
    (entry) => entry.id === idOrPackage || entry.package === idOrPackage,
  );

  if (!removed) {
    return { lockfile };
  }

  return {
    removed,
    lockfile: {
      extensions: lockfile.extensions.filter(
        (entry) => entry.id !== removed.id,
      ),
    },
  };
}
