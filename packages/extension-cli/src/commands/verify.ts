import type { Command } from 'commander';
import { CliError } from '../errors';
import { readLockfile } from '../lockfile';
import { resolveLockfileExtensions } from '../package';
import type { ResolvedExtension, RootOptions } from '../types';
import { formatList, getRootDir, hashManifest } from '../utils';

export async function verifyExtensions(
  options: RootOptions = {},
): Promise<ResolvedExtension[]> {
  const rootDir = getRootDir(options.root);
  const lockfile = readLockfile(rootDir);
  const extensions = resolveLockfileExtensions(rootDir, lockfile);
  const issues: string[] = [];

  extensions.forEach((extension) => {
    const entry = extension.entry!;
    const manifestHash = hashManifest(extension.manifest);

    if (manifestHash !== entry.manifestHash) {
      issues.push(
        `Manifest changed for "${entry.id}". Run "pnpm extensions:add ${entry.package}@${entry.version}".`,
      );
    }

    const capabilities: string[] = [...extension.manifest.capabilities].sort();
    const addedCapabilities = capabilities.filter(
      (capability) => !entry.capabilities.includes(capability),
    );
    const removedCapabilities = entry.capabilities.filter(
      (capability) => !capabilities.includes(capability),
    );

    if (addedCapabilities.length > 0 || removedCapabilities.length > 0) {
      issues.push(
        `Capabilities changed for "${entry.id}": added [${formatList(
          addedCapabilities,
        )}], removed [${formatList(removedCapabilities)}]. Review the change and update the lockfile.`,
      );
    }
  });

  if (issues.length > 0) {
    throw new CliError('Extension verification failed.', issues);
  }

  console.log(
    `Verified ${extensions.length} extension(s) against the installed packages.`,
  );

  return extensions;
}

export function registerVerifyCommand(program: Command): void {
  program
    .command('verify')
    .description('Validate the lockfile against installed extension packages')
    .option('-r, --root <dir>', 'Deployment root')
    .action(async (options: RootOptions) => {
      await verifyExtensions(options);
    });
}
