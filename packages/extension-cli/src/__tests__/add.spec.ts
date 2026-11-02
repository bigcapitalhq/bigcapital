import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { addExtension } from '../commands/add';
import { removeExtension } from '../commands/remove';
import { syncExtensions } from '../commands/sync';
import { verifyExtensions } from '../commands/verify';
import { readLockfile } from '../lockfile';
import { getServerGeneratedPath, getWebappGeneratedPath } from '../paths';

const tempDirs: string[] = [];

const writeJson = (filePath: string, value: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

const buildFixture = () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bigcapital-ext-cli-'));
  tempDirs.push(rootDir);

  writeJson(path.join(rootDir, 'package.json'), {
    name: 'fixture-root',
    version: '0.0.0',
  });

  const packageDir = path.join(rootDir, 'node_modules', '@acme', 'reports');

  const packageJson = {
    name: '@acme/reports',
    version: '1.0.0',
    main: 'server.js',
    exports: {
      '.': './server.js',
      './server': './server.js',
      './web': './web.js',
      './package.json': './package.json',
    },
    bigcapital: {
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
      server: { entry: './server.js' },
      web: { entry: './web.js' },
      capabilities: ['events.subscribe'],
      defaultEnabled: true,
    },
  };

  writeJson(path.join(packageDir, 'package.json'), packageJson);
  fs.writeFileSync(
    path.join(packageDir, 'server.js'),
    'exports.extension = {};\n',
  );
  fs.writeFileSync(
    path.join(packageDir, 'web.js'),
    'exports.extension = {};\n',
  );

  return { rootDir, packageDir, packageJson };
};

afterEach(() => {
  tempDirs.splice(0).forEach((dir) => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('extension CLI integration', () => {
  it('adds, verifies, syncs, and removes an installed extension', async () => {
    const { rootDir } = buildFixture();

    await addExtension('@acme/reports@1.0.0', { root: rootDir });

    const lockfile = readLockfile(rootDir);

    expect(lockfile.extensions).toHaveLength(1);
    expect(lockfile.extensions[0]).toMatchObject({
      id: 'acme.reports',
      package: '@acme/reports',
      version: '1.0.0',
      capabilities: ['events.subscribe'],
      enabledByDefault: true,
    });

    await expect(verifyExtensions({ root: rootDir })).resolves.toHaveLength(1);

    await syncExtensions({ root: rootDir });
    await expect(
      syncExtensions({ root: rootDir, check: true }),
    ).resolves.toHaveLength(1);

    const serverFile = fs.readFileSync(getServerGeneratedPath(rootDir), 'utf8');
    const webappFile = fs.readFileSync(getWebappGeneratedPath(rootDir), 'utf8');

    expect(serverFile).toContain('@acme/reports/server');
    expect(webappFile).toContain('@acme/reports/web');

    await removeExtension('acme.reports', { root: rootDir });
    expect(readLockfile(rootDir).extensions).toHaveLength(0);
  });

  it('detects capability changes', async () => {
    const { rootDir, packageDir, packageJson } = buildFixture();

    await addExtension('@acme/reports@1.0.0', { root: rootDir });

    const changedPackageJson = {
      ...packageJson,
      bigcapital: {
        ...packageJson.bigcapital,
        capabilities: [
          ...packageJson.bigcapital.capabilities,
          'tenant.db.read',
        ],
      },
    };

    writeJson(path.join(packageDir, 'package.json'), changedPackageJson);

    await expect(verifyExtensions({ root: rootDir })).rejects.toMatchObject({
      name: 'CliError',
      details: expect.arrayContaining([
        expect.stringContaining('Capabilities changed'),
      ]),
    });
  });

  it('rejects an installed version that does not match the requested version', async () => {
    const { rootDir } = buildFixture();

    await expect(
      addExtension('@acme/reports@2.0.0', { root: rootDir }),
    ).rejects.toThrow(/not "2.0.0"/);
  });
});
