import path from 'path';
import pug from 'pug';

export function templateRender(filePath: string, options: Record<string, any>) {
  const basePath = path.join(global.__resources_dir, '/views');
  return pug.renderFile(`${basePath}/${filePath}.pug`, options);
}
