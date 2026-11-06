import path from 'node:path';
import type { Command } from 'commander';
import { HOST_EXTENSION_API_VERSION } from '@bigcapital/extension-sdk';
import { generateServerFile } from '../generators/server';
import { generateWebappFile } from '../generators/webapp';
import { getLockfilePath, readLockfile } from '../lockfile';
import { resolveExtensionEntry } from '../package';
import { getServerGeneratedPath, getWebappGeneratedPath } from '../paths';
import type { RootOptions } from '../types';
import { formatList, getRootDir, readTextFileOrUndefined } from '../utils';

export async function doctorExtensions(
  options: RootOptions = {},
): Promise<void> {
  const rootDir = getRootDir(options.root);
  const lockfile = readLockfile(rootDir);

  console.log(`Root: ${rootDir}`);
  console.log(`Host extension API: ${HOST_EXTENSION_API_VERSION}`);
  console.log(`Lockfile: ${getLockfilePath(rootDir)}`);
  console.log(`Locked extensions: ${lockfile.extensions.length}`);

  if (lockfile.extensions.length > 0) {
    const resolved = [];

    for (const entry of lockfile.extensions) {
      try {
        const extension = resolveExtensionEntry(rootDir, entry);
        resolved.push(extension);

        console.log('');
        console.log(`- ${entry.id}@${entry.version} (${entry.package})`);
        console.log(
          `  trust: ${extension.manifest.trust} | server: ${
            extension.hasServer ? 'yes' : 'no'
          } | web: ${extension.hasWeb ? 'yes' : 'no'}`,
        );
        console.log(
          `  capabilities: ${formatList(extension.manifest.capabilities)}`,
        );
      } catch (error) {
        console.log('');
        console.log(`- ${entry.id}@${entry.version} (${entry.package})`);
        console.log(`  error: ${(error as Error).message}`);
      }
    }

    const serverPath = getServerGeneratedPath(rootDir);
    const webappPath = getWebappGeneratedPath(rootDir);
    const serverContent = await generateServerFile(resolved);
    const webappContent = await generateWebappFile(resolved);

    console.log('');
    console.log('Generated files:');
    console.log(
      `  ${path.relative(rootDir, serverPath)}: ${
        readTextFileOrUndefined(serverPath) === serverContent
          ? 'up to date'
          : 'out of date (run pnpm extensions:sync)'
      }`,
    );
    console.log(
      `  ${path.relative(rootDir, webappPath)}: ${
        readTextFileOrUndefined(webappPath) === webappContent
          ? 'up to date'
          : 'out of date (run pnpm extensions:sync)'
      }`,
    );
  }
}

export function registerDoctorCommand(program: Command): void {
  program
    .command('doctor')
    .description(
      'Print extension package, capability, and generated-file status',
    )
    .option('-r, --root <dir>', 'Deployment root')
    .action(async (options: RootOptions) => {
      await doctorExtensions(options);
    });
}
