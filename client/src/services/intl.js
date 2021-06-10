import { createIntl, createIntlCache } from 'react-intl';
// import messages from 'lang/en/index.json';
import arabicMessages from 'lang/ar/index.json';
import englishMessages from 'lang/en/index.json';

import { setLocale } from 'yup';
import { locale } from 'lang/en/locale';

// This is optional but highly recommended since it prevents memory leak
const cache = createIntlCache();

// Creates globa intl instance.
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
