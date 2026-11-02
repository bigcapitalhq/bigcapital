import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getLockfilePath, readLockfile, writeLockfile } from '../lockfile';

const tempDirs: string[] = [];

const createRoot = () => {
  const rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'bigcapital-ext-lock-'),
  );
  tempDirs.push(rootDir);
  return rootDir;
};

afterEach(() => {
  tempDirs.splice(0).forEach((dir) => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('lockfile', () => {
  it('returns an empty lockfile when the file does not exist', () => {
    expect(readLockfile(createRoot())).toEqual({ extensions: [] });
  });

  it('writes and reads a sorted lockfile', async () => {
    const rootDir = createRoot();

    await writeLockfile(rootDir, {
      extensions: [
        {
          id: 'b.extension',
          package: '@acme/b',
          version: '1.0.0',
          manifestHash: 'sha256:b',
          capabilities: [],
          enabledByDefault: false,
        },
        {
          id: 'a.extension',
          package: '@acme/a',
          version: '1.0.0',
          manifestHash: 'sha256:a',
          capabilities: ['events.subscribe'],
          enabledByDefault: true,
        },
      ],
    });

    const lockfile = readLockfile(rootDir);

    expect(lockfile.extensions.map((entry) => entry.id)).toEqual([
      'a.extension',
      'b.extension',
    ]);
    expect(fs.existsSync(getLockfilePath(rootDir))).toBe(true);
  });

  it('rejects duplicate ids', () => {
    const rootDir = createRoot();

    fs.writeFileSync(
      getLockfilePath(rootDir),
      JSON.stringify({
        extensions: [
          {
            id: 'acme.reports',
            package: '@acme/reports',
            version: '1.0.0',
            manifestHash: 'sha256:a',
            capabilities: [],
            enabledByDefault: false,
          },
          {
            id: 'acme.reports',
            package: '@acme/other',
            version: '1.0.0',
            manifestHash: 'sha256:b',
            capabilities: [],
            enabledByDefault: false,
          },
        ],
      }),
    );

    expect(() => readLockfile(rootDir)).toThrow(/Duplicate extension id/);
  });
});
