import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { find } from 'lodash';
import rtlDetect from 'rtl-detect';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';

const SUPPORTED_LOCALES = [
  { name: "English", value: "en" },
  { name: 'العربية', value: 'ar' }
];

/**
 * Retrieve the current local.
 */
function getCurrentLocal() {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: "lang",
    cookieLocaleKey: "lang",
    localStorageLocaleKey: "lang",
  });
  if (!find(SUPPORTED_LOCALES, { value: currentLocale })) {
    currentLocale = "en";
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
 * Modifies the html document direction to RTl if it was rtl-language.
 */
function useDocumentDirectionModifier(locale) {
  React.useEffect(() => {
    const isRTL = rtlDetect.isRtlLang(locale);

    if (isRTL) {
      const htmlDocument = document.querySelector('html');
      htmlDocument.setAttribute('dir', 'rtl');
      htmlDocument.setAttribute('lang', locale);
    }
  }, []);
}

/**
 * Application Intl loader.
 */
export default function AppIntlLoader({
  children
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const currentLocale = getCurrentLocal();

  // Modifies the html document direction
  useDocumentDirectionModifier(currentLocale);

  React.useEffect(() => {
    // Lodas the locales data file.
    loadLocales(currentLocale).then((results) => {
      return intl.init({
        currentLocale,
        locales: {
          [currentLocale]: results,
        },
      });
    }).then(() => {
      moment.locale('ar-ly');
      setIsLoading(false);
    });
  }, [currentLocale, setIsLoading]);

  return (
    <DashboardLoadingIndicator isLoading={isLoading}>
      {children}
    </DashboardLoadingIndicator>
  ); 
}