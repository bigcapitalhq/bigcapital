// @ts-nocheck
import React from 'react';
import moment from 'moment';
import { setLocale } from 'yup';
import intl from 'react-intl-universal';
import { find } from 'lodash';
import rtlDetect from 'rtl-detect';
import * as R from 'ramda';

import { AppIntlProvider } from './AppIntlProvider';
import { useSplashLoading } from '@/hooks/state';

import { useWatchImmediate } from '../hooks';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

const SUPPORTED_LOCALES = [
  { name: 'English', value: 'en' },
  { name: 'العربية', value: 'ar' },
];

/**
 * Retrieve the current local.
 */
function getCurrentLocal() {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: 'lang',
    cookieLocaleKey: 'locale',
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

function transformMomentLocale(currentLocale) {
  return currentLocale === 'ar' ? 'ar-ly' : currentLocale;
}

/**
 * Loads application locales of the given current locale.
 * @param {string} currentLocale
 * @returns {{ isLoading: boolean }}
 */
function useAppLoadLocales(currentLocale) {
  const [startLoading, stopLoading] = useSplashLoading();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Loads the locales data file.
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
        moment.locale(transformMomentLocale(currentLocale));
        setIsLoading(false);
      });
  }, [currentLocale, stopLoading]);

  // Watches the value to start/stop splash screen.
  useWatchImmediate(
    (value) => (value ? startLoading() : stopLoading()),
    isLoading,
  );
  return { isLoading };
}

/**
 * Loads application yup locales based on the given current locale.
 * @param {string} currentLocale
 * @returns {{ isLoading: boolean }}
 */
function useAppYupLoadLocales(currentLocale) {
  const [startLoading, stopLoading] = useSplashLoading();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadYupLocales(currentLocale)
      .then(({ locale }) => {
        setLocale(locale);
        setIsLoading(false);
      })
      .then(() => {});
  }, [currentLocale, stopLoading]);

  // Watches the value to start/stop splash screen.
  useWatchImmediate(
    (value) => (value ? startLoading() : stopLoading()),
    isLoading,
  );
  return { isLoading };
}

/**
 * Application Intl loader.
 */
function AppIntlLoader({ children }) {
  // Retrieve the current locale.
  const currentLocale = getCurrentLocal();

  // Determines the document direction based on the given locale.
  const isRTL = rtlDetect.isRtlLang(currentLocale);

  // Modifies the html document direction
  useDocumentDirectionModifier(currentLocale, isRTL);

  // Loads yup localization of the given locale.
  const { isLoading: isAppYupLocalesLoading } =
    useAppYupLoadLocales(currentLocale);

  // Loads application locales of the given locale.
  const { isLoading: isAppLocalesLoading } = useAppLoadLocales(currentLocale);

  // Determines whether the app locales loading.
  const isLoading = isAppYupLocalesLoading || isAppLocalesLoading;

  return (
    <AppIntlProvider currentLocale={currentLocale} isRTL={isRTL}>
      {isLoading ? null : children}
    </AppIntlProvider>
  );
}

export default R.compose(withDashboardActions)(AppIntlLoader);
