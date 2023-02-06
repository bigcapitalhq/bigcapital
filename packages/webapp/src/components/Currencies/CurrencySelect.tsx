// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { MenuItem, Button } from '@blueprintjs/core';
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
 * @param {*} currency
 * @returns
 */
const currencyItemRenderer = (currency, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={currency.currency_name}
      label={currency.currency_code.toString()}
      key={currency.id}
      onClick={handleClick}
    />
  );
};

const currencySelectProps = {
  itemPredicate: currencyItemPredicate,
  itemRenderer: currencyItemRenderer,
  valueAccessor: 'currency_code',
  labelAccessor: 'currency_code',
};

/**
 *
 * @param {*} currencies
 * @returns
 */
export function CurrencySelect({ currencies, ...rest }) {
  return (
    <FSelect
      {...currencySelectProps}
      {...rest}
      items={currencies}
      input={CurrnecySelectButton}
    />
  );
}

/**
 * @param {*} label
 * @returns
 */
function CurrnecySelectButton({ label }) {
  return <Button text={label ? label : intl.get('select_currency_code')} />;
}
