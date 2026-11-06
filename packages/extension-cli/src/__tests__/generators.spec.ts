import { describe, expect, it } from 'vitest';
import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { generateServerFile } from '../generators/server';
import { generateWebappFile } from '../generators/webapp';
import type { ResolvedExtension } from '../types';

const buildExtension = (
  packageName: string,
  options: {
    server?: boolean;
    web?: boolean;
    migrations?: string;
  } = {},
): ResolvedExtension => {
  const hasServer = options.server ?? true;
  const hasWeb = options.web ?? true;

  return {
    packageName,
    packageVersion: '1.0.0',
    packageDir: '/tmp/extension',
    packageJson: { name: packageName, version: '1.0.0' },
    manifest: parseExtensionManifest({
      id: packageName.replace(/^@[^/]+\//, ''),
      name: packageName,
      version: '1.0.0',
      trust: 'partner',
      ...(hasServer ? { server: { entry: './server.js' } } : {}),
      ...(hasWeb ? { web: { entry: './web.js' } } : {}),
      ...(options.migrations ? { migrations: options.migrations } : {}),
    }),
    hasServer,
    hasWeb,
  };
};

describe('generators', () => {
  it('generates empty files when no extensions are installed', async () => {
    const server = await generateServerFile([]);
    const webapp = await generateWebappFile([]);

    expect(server).toContain(
      'export const nativeExtensions: BigcapitalExtension[] = [];',
    );
    expect(webapp).toContain(
      'export const webExtensions: BigcapitalWebExtension[] = [];',
    );
  });

  it('generates namespaced imports and extension arrays', async () => {
    const extension = buildExtension('@acme/bigcapital-reports');
    const server = await generateServerFile([extension]);
    const webapp = await generateWebappFile([extension]);

    expect(server).toContain(
      "import { extension as bigcapitalReports } from '@acme/bigcapital-reports/server';",
    );
    expect(server).toContain(
      'export const nativeExtensions: BigcapitalExtension[] = [bigcapitalReports];',
    );
    expect(webapp).toContain(
      "import { extension as bigcapitalReportsWeb } from '@acme/bigcapital-reports/web';",
    );
    expect(webapp).toContain(
      'export const webExtensions: BigcapitalWebExtension[] = [bigcapitalReportsWeb];',
    );
  });

  it('skips imports for extensions without a server or web entry', async () => {
    const webOnly = buildExtension('@acme/web-only', {
      server: false,
      web: true,
    });
    const serverOnly = buildExtension('@acme/server-only', {
      server: true,
      web: false,
    });

    const server = await generateServerFile([webOnly, serverOnly]);
    const webapp = await generateWebappFile([webOnly, serverOnly]);

    expect(server).toContain('@acme/server-only/server');
    expect(server).not.toContain('@acme/web-only/server');
    expect(webapp).toContain('@acme/web-only/web');
    expect(webapp).not.toContain('@acme/server-only/web');
  });

  it('emits an empty migration directory map when none declare migrations', async () => {
    const server = await generateServerFile([
      buildExtension('@acme/no-migrations'),
    ]);

    expect(server).toContain(
      'export const extensionMigrationDirectories: Record<string, string> = {};',
    );
  });

  it('emits migration directories resolved from the package root', async () => {
    const server = await generateServerFile([
      buildExtension('@acme/reports', {
        migrations: './dist/migrations',
      }),
    ]);

    expect(server).toContain("import * as path from 'node:path';");
    expect(server).toContain(
      "const reportsPackageDir = path.dirname(\n  require.resolve('@acme/reports/package.json'),\n);",
    );
    expect(server).toContain(
      "reports: path.join(reportsPackageDir, 'dist/migrations'),",
    );
  });
});
