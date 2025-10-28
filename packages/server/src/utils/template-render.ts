import * as path from 'path';
import * as pug from 'pug';

export function templateRender(filePath: string, options: Record<string, any>) {
  const templatePath = path.join(global.__views_dirname, `${filePath}.pug`);
  return pug.renderFile(templatePath, options);
}
