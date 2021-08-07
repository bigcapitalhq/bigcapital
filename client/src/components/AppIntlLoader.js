import React from 'react';
import moment from 'moment';
import { setLocale } from 'yup';
import intl from 'react-intl-universal';
import { find } from 'lodash';
import rtlDetect from 'rtl-detect';
import { AppIntlProvider } from './AppIntlProvider';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';

const SUPPORTED_LOCALES = [
  { name: 'English', value: 'en' },
  { name: 'العربية', value: 'ar-ly' },
];

/**
 * Retrieve the current local.
 */
function getCurrentLocal() {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: 'lang',
    cookieLocaleKey: 'lang',
    localStorageLocaleKey: 'lang',
  });
  if (!find(SUPPORTED_LOCALES, { value: currentLocale })) {
    currentLocale = 'en';
  }
  return currentLocale;
}

/**
 * Loads the localization data of the given locale.
 */
function loadLocales(currentLocale) {
  return import(`../lang/${currentLocale}/index.json`);
}

/**
 * Loads the localization data of yup validation library.
 */
function loadYupLocales(currentLocale) {
  return import(`../lang/${currentLocale}/locale`);
}

/**
 * Modifies the html document direction to RTl if it was rtl-language.
 */
function useDocumentDirectionModifier(locale, isRTL) {
  React.useEffect(() => {
    if (isRTL) {
      const htmlDocument = document.querySelector('html');
      htmlDocument.setAttribute('dir', 'rtl');
      htmlDocument.setAttribute('lang', locale);
    }
  }, [isRTL, locale]);
}

/**
 * Application Intl loader.
 */
export default function AppIntlLoader({ children }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const currentLocale = getCurrentLocal();

  const isRTL = rtlDetect.isRtlLang(currentLocale);

  // Modifies the html document direction
  useDocumentDirectionModifier(currentLocale, isRTL);

  React.useEffect(() => {
    // Lodas the locales data file.
    loadLocales(currentLocale)
      .then((results) => {
        return intl.init({
          currentLocale,
          locales: {
            [currentLocale]: results,
          },
        });
      })
      .then(() => {
        moment.locale(currentLocale);
        setIsLoading(false);
      });
  }, [currentLocale, setIsLoading]);

  React.useEffect(() => {
    loadYupLocales(currentLocale)
      .then(({ locale }) => {
        setLocale(locale);
      })
      .then(() => {});
  }, [currentLocale]);

  return (
    <AppIntlProvider currentLocale={currentLocale} isRTL={isRTL}>
      <DashboardLoadingIndicator isLoading={isLoading}>
        {children}
      </DashboardLoadingIndicator>
    </AppIntlProvider>
  );
}
