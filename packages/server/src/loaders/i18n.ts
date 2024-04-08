import { I18n } from 'i18n';

export default () =>
  new I18n({
    locales: ['en', 'ar'],
    register: global,
    directory: process.env.APP_LOCALES_DIR,
    updateFiles: false,
  });
