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
  const normalizedTitle = currency.currencyCode.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${currency.currencyCode}. ${normalizedTitle}`.indexOf(normalizedQuery) >=
      0
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
      valueAccessor={'currencyCode'}
      textAccessor={'currencyName'}
      labelAccessor={'currencyCode'}
      {...rest}
      items={currencies}
      placeholder={intl.get('select_currency_code')}
    />
  );
}
