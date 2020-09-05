import i18n from 'i18n';
import path from 'path';

export default () => i18n.configure({
  locales: ['en', 'ar'],
  register: global,
  directory: path.join(global.rootPath, 'src/locales'),
  updateFiles: false
})