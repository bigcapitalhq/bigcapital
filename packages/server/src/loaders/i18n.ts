import { I18n } from 'i18n';

export default () => new I18n({
  locales: ['en', 'ar'],
  register: global,
  directory: global.__locales_dir,
  updateFiles: false,
});