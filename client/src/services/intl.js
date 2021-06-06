import { createIntl, createIntlCache } from 'react-intl';
// import messages from 'lang/en/index.json';
import messages from 'lang/ar/index.json';
import { setLocale } from 'yup';
import { locale } from 'lang/en/locale';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'en',
    messages,
  },
  cache,
);

setLocale(locale);

const { formatMessage } = intl;

export { formatMessage };

export default intl;
