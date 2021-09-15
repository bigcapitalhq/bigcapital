import React from 'react';
import moment from 'moment';
import { setLocale } from 'yup';
import intl from 'react-intl-universal';
import { find } from 'lodash';
import rtlDetect from 'rtl-detect';
import * as R from 'ramda';

import { AppIntlProvider } from './AppIntlProvider';

import withDashboardActions from '../containers/Dashboard/withDashboardActions';
import withDashboard from '../containers/Dashboard/withDashboard';

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
 * Application Intl loader.
 */
function AppIntlLoader({ appIntlIsLoading, setAppIntlIsLoading, children }) {
  const [isLocalsLoading, setIsLocalsLoading] = React.useState(true);
  const [isYupLoading, setIsYupLoading] = React.useState(true);

  // Retrieve the current locale.
  const currentLocale = getCurrentLocal();

  // Detarmines the document direction based on the given locale.
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
        moment.locale(transformMomentLocale(currentLocale));
        setIsLocalsLoading(false);
      });
  }, [currentLocale, setIsLocalsLoading]);

  React.useEffect(() => {
    loadYupLocales(currentLocale)
      .then(({ locale }) => {
        setLocale(locale);
        setIsYupLoading(false);
      })
      .then(() => {});
  }, [currentLocale]);

  React.useEffect(() => {
    if (!isLocalsLoading && !isYupLoading) {
      setAppIntlIsLoading(false);
    }
  });

  return (
    <AppIntlProvider currentLocale={currentLocale} isRTL={isRTL}>
      {appIntlIsLoading ? null : children}
    </AppIntlProvider>
  );
}

export default R.compose(
  withDashboardActions,
  withDashboard(({ appIntlIsLoading }) => ({ appIntlIsLoading })),
)(AppIntlLoader);
