import path from 'node:path';
import type { Command } from 'commander';
import { generateServerFile } from '../generators/server';
import { generateWebappFile } from '../generators/webapp';
import { getServerGeneratedPath, getWebappGeneratedPath } from '../paths';
import { readLockfile } from '../lockfile';
import { resolveLockfileExtensions } from '../package';
import { CliError } from '../errors';
import type { ResolvedExtension, RootOptions } from '../types';
import { getRootDir, readTextFileOrUndefined, writeTextFile } from '../utils';

export interface SyncOptions extends RootOptions {
  check?: boolean;
}

export async function syncExtensions(
  options: SyncOptions = {},
): Promise<ResolvedExtension[]> {
  const rootDir = getRootDir(options.root);
  const lockfile = readLockfile(rootDir);
  const extensions = resolveLockfileExtensions(rootDir, lockfile);

  const serverContent = await generateServerFile(extensions);
  const webappContent = await generateWebappFile(extensions);

  const serverPath = getServerGeneratedPath(rootDir);
  const webappPath = getWebappGeneratedPath(rootDir);

  if (options.check) {
    const issues: string[] = [];

    if (readTextFileOrUndefined(serverPath) !== serverContent) {
      issues.push(`Out of date: ${path.relative(rootDir, serverPath)}`);
    }

    if (readTextFileOrUndefined(webappPath) !== webappContent) {
      issues.push(`Out of date: ${path.relative(rootDir, webappPath)}`);
    }

    if (issues.length > 0) {
      throw new CliError(
        'Generated extension imports are out of date. Run "pnpm extensions:sync".',
        issues,
      );
    }

    console.log(
      `Generated extension imports are up to date (${extensions.length} extension(s)).`,
    );

    return extensions;
  }

  writeTextFile(serverPath, serverContent);
  writeTextFile(webappPath, webappContent);

  console.log(
    `Synced ${extensions.length} extension(s) into generated imports.`,
  );
  console.log(`  ${path.relative(rootDir, serverPath)}`);
  console.log(`  ${path.relative(rootDir, webappPath)}`);

  return extensions;
}

export function registerSyncCommand(program: Command): void {
  program
    .command('sync')
    .description(
      'Regenerate server and webapp imports from bigcapital.extensions.json',
    )
    .option('-r, --root <dir>', 'Deployment root')
    .option(
      '--check',
      'Fail if the generated files are out of date instead of writing them',
    )
    .action(async (options: SyncOptions) => {
      await syncExtensions(options);
    });
}
