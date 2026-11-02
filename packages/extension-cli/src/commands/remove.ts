import type { Command } from 'commander';
import { CliError } from '../errors';
import { readLockfile, removeLockEntry, writeLockfile } from '../lockfile';
import type { RootOptions } from '../types';
import { getRootDir } from '../utils';
import { syncExtensions } from './sync';

export interface RemoveOptions extends RootOptions {
  sync?: boolean;
}

export async function removeExtension(
  idOrPackage: string,
  options: RemoveOptions = {},
): Promise<void> {
  const rootDir = getRootDir(options.root);
  const lockfile = readLockfile(rootDir);
  const result = removeLockEntry(lockfile, idOrPackage);

  if (!result.removed) {
    throw new CliError(
      `Extension "${idOrPackage}" is not present in bigcapital.extensions.json.`,
    );
  }

  writeLockfile(rootDir, result.lockfile);
  console.log(`Removed ${result.removed.id}@${result.removed.version}.`);

  if (options.sync) {
    await syncExtensions({ root: rootDir });
  } else {
    console.log('Next: pnpm extensions:sync');
  }
}

export function registerRemoveCommand(program: Command): void {
  program
    .command('remove <idOrPackage>')
    .description('Remove an extension from bigcapital.extensions.json')
    .option('-r, --root <dir>', 'Deployment root')
    .option(
      '--sync',
      'Regenerate extension imports after updating the lockfile',
    )
    .action(async (idOrPackage: string, options: RemoveOptions) => {
      await removeExtension(idOrPackage, options);
    });
}
