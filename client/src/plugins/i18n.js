import Vue from 'vue';

const defaultLocale = 'en';
const loadedLangauges = [];
const currentLocale = Vue.i18n.locale();

function setLanguage(locale, messages) {
  const localeMessages = messages.default;

  Vue.i18n.add(locale, { ...localeMessages });

  loadedLangauges.push(locale);
  Vue.i18n.set(locale);
}

async function loadAsyncLanguage(locale) {
  if (locale !== currentLocale) {
    if (!loadedLangauges.includes(locale)) {
      const messages = await import(/* webpackChunkName: "lang-[request]" */ `@/lang/${locale}/app`);
      setLanguage(locale, messages);
    }
  }
}

(async () => {
  await loadAsyncLanguage(defaultLocale);
})();

export default loadAsyncLanguage;
