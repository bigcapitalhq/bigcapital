// help me export default
// and I want to export rootDir

import path from 'node:path';

const rootDir = `${__dirname}/../../`;

export const globals = {
  rootDir: rootDir,
  resourcesDir: path.join(rootDir, 'resources'),
  localesDir: path.join(rootDir, 'resources', 'locales'),
  viewsDir: path.join(rootDir, 'views'),
  storageDir: path.join(rootDir, 'storage'),
};
