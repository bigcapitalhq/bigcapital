// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { FSelect } from '../Forms';

/**
 *
 * @param {*} query
 * @param {*} currency
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const currencyItemPredicate = (query, currency, _index, exactMatch) => {
  const normalizedTitle = currency.currency_code.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${currency.currency_code}. ${normalizedTitle}`.indexOf(
        normalizedQuery,
      ) >= 0
    );
  }
};

/**
 *
 * @param {*} currencies
 * @returns
 */
export function CurrencySelect({ currencies, ...rest }) {
  return (
    <FSelect
      itemPredicate={currencyItemPredicate}
      valueAccessor={'currency_code'}
      textAccessor={'currency_name'}
      labelAccessor={'currency_code'}
      {...rest}
      items={currencies}
      placeholder={intl.get('select_currency_code')}
    />
  );
}
