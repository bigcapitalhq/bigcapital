import type { ResolvedExtension } from '../types';
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

  const lines = [
    GENERATED_HEADER,
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

  return formatGeneratedFile(lines.join('\n'));
}
