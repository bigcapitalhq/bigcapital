import path from 'node:path';

export const SERVER_GENERATED_FILE =
  'packages/server/src/extensions/generated/extensions.generated.ts';

export const WEBAPP_GENERATED_FILE =
  'packages/webapp/src/extensions/generated/plugins.generated.ts';

export function getServerGeneratedPath(rootDir: string): string {
  return path.join(rootDir, SERVER_GENERATED_FILE);
}

export function getWebappGeneratedPath(rootDir: string): string {
  return path.join(rootDir, WEBAPP_GENERATED_FILE);
}
