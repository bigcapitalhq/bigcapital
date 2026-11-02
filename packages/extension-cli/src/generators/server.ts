import type { ResolvedExtension } from '../types';
import { createUniqueIdentifiers } from '../utils';
import {
  GENERATED_HEADER,
  buildImportLines,
  formatGeneratedFile,
} from './shared';

export async function generateServerFile(
  extensions: ResolvedExtension[],
): Promise<string> {
  const {
    extensions: included,
    identifiers,
    imports,
  } = buildImportLines(extensions, 'server', '');

  const migrationExtensions = extensions
    .filter((extension) => Boolean(extension.manifest.migrations))
    .sort((a, b) => a.packageName.localeCompare(b.packageName));

  const migrationDirIdentifiers = createUniqueIdentifiers(
    migrationExtensions.map((extension) => extension.packageName),
    'PackageDir',
  );

  const lines = [
    GENERATED_HEADER,
    ...(migrationExtensions.length > 0
      ? ["import * as path from 'node:path';"]
      : []),
    ...imports,
    "import type { BigcapitalExtension } from '@bigcapital/extension-sdk/server';",
    '',
  ];

  if (included.length === 0) {
    lines.push('export const nativeExtensions: BigcapitalExtension[] = [];');
  } else {
    lines.push('export const nativeExtensions: BigcapitalExtension[] = [');
    included.forEach((extension) => {
      lines.push(`  ${identifiers.get(extension.packageName)},`);
    });
    lines.push('];');
  }

  lines.push('');

  if (migrationExtensions.length === 0) {
    lines.push(
      'export const extensionMigrationDirectories: Record<string, string> = {};',
    );
  } else {
    migrationExtensions.forEach((extension) => {
      lines.push(
        `const ${migrationDirIdentifiers.get(
          extension.packageName,
        )} = path.dirname(require.resolve('${extension.packageName}/package.json'));`,
      );
    });

    lines.push('');
    lines.push(
      'export const extensionMigrationDirectories: Record<string, string> = {',
    );

    migrationExtensions.forEach((extension) => {
      const migrationsPath = extension.manifest.migrations!.replace(
        /^\.?\//,
        '',
      );

      lines.push(
        `  '${extension.manifest.id}': path.join(${migrationDirIdentifiers.get(
          extension.packageName,
        )}, '${migrationsPath}'),`,
      );
    });

    lines.push('};');
  }

  lines.push('');

  return formatGeneratedFile(lines.join('\n'));
}
