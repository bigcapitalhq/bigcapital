import * as JsMoneyCurrencies from 'js-money/lib/currency';
import { additionalCurrencies } from '@bigcapital/utils';

/**
 * Every currency the application supports: the `js-money` table plus the ISO
 * 4217 currencies it does not ship (e.g. ANG, XCG). The two sets do not
 * overlap.
 */
export const Currencies: Record<string, any> = {
  ...JsMoneyCurrencies,
  ...additionalCurrencies,
};
