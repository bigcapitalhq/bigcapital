import type { Command } from 'commander';
import { CliError } from '../errors';
import { readLockfile, upsertLockEntry, writeLockfile } from '../lockfile';
import { createLockEntry, resolveExtensionSpec } from '../package';
import type { RootOptions } from '../types';
import { assertRoot, formatList, getRootDir } from '../utils';
import { syncExtensions } from './sync';

export interface AddOptions extends RootOptions {
  sync?: boolean;
}

export async function addExtension(
  packageSpec: string,
  options: AddOptions = {},
): Promise<void> {
  const rootDir = getRootDir(options.root);
  assertRoot(rootDir);

  const resolved = resolveExtensionSpec(rootDir, packageSpec);
  const entry = createLockEntry(resolved);
  const lockfile = readLockfile(rootDir);

  const existingById = lockfile.extensions.find(
    (current) => current.id === entry.id,
  );
  const existingByPackage = lockfile.extensions.find(
    (current) => current.package === entry.package,
  );

  if (existingById && existingById.package !== entry.package) {
    throw new CliError(
      `Extension id "${entry.id}" is already provided by "${existingById.package}". Remove it before adding "${entry.package}".`,
    );
  }

  if (existingByPackage && existingByPackage.id !== entry.id) {
    throw new CliError(
      `Package "${entry.package}" is already locked as extension "${existingByPackage.id}". Remove it before adding "${entry.id}".`,
    );
  }

  const previous = existingById ?? existingByPackage;
  const nextLockfile = upsertLockEntry(lockfile, entry);

  writeLockfile(rootDir, nextLockfile);

  if (previous) {
    console.log(
      `Updated ${entry.id} from ${previous.version} to ${entry.version}.`,
    );

    const addedCapabilities = entry.capabilities.filter(
      (capability) => !previous.capabilities.includes(capability),
    );
    const removedCapabilities = previous.capabilities.filter(
      (capability) => !entry.capabilities.includes(capability),
    );

    if (addedCapabilities.length > 0 || removedCapabilities.length > 0) {
      console.log(
        `Capability change: added [${formatList(
          addedCapabilities,
        )}], removed [${formatList(removedCapabilities)}]. Review this change.`,
      );
    }
  } else {
    console.log(`Added ${entry.id}@${entry.version} (${entry.package}).`);
  }

  console.log(
    `Server entry: ${resolved.hasServer ? 'yes' : 'no'} | Web entry: ${
      resolved.hasWeb ? 'yes' : 'no'
    }`,
  );
  console.log(`Capabilities: ${formatList(entry.capabilities)}`);

  if (options.sync) {
    await syncExtensions({ root: rootDir });
  } else {
    console.log('Next: pnpm extensions:sync');
  }
}

export function registerAddCommand(program: Command): void {
  program
    .command('add <packageSpec>')
    .description(
      'Add or update an installed extension in bigcapital.extensions.json',
    )
    .option('-r, --root <dir>', 'Deployment root')
    .option(
      '--sync',
      'Regenerate extension imports after updating the lockfile',
    )
    .action(async (packageSpec: string, options: AddOptions) => {
      await addExtension(packageSpec, options);
    });
}
