import type { ResolvedExtension } from '../types';
import {
  GENERATED_HEADER,
  buildImportLines,
  formatGeneratedFile,
} from './shared';

export async function generateWebappFile(
  extensions: ResolvedExtension[],
): Promise<string> {
  const {
    extensions: included,
    identifiers,
    imports,
  } = buildImportLines(extensions, 'web', 'Web');

  const lines = [
    GENERATED_HEADER,
    ...imports,
    "import type { BigcapitalWebExtension } from '@bigcapital/extension-sdk/web';",
    '',
  ];

  if (included.length === 0) {
    lines.push('export const webExtensions: BigcapitalWebExtension[] = [];');
  } else {
    lines.push('export const webExtensions: BigcapitalWebExtension[] = [');
    included.forEach((extension) => {
      lines.push(`  ${identifiers.get(extension.packageName)},`);
    });
    lines.push('];');
  }

  lines.push('');

  return formatGeneratedFile(lines.join('\n'));
}
