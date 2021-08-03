import { sumBy, isEmpty, last } from 'lodash';
import * as R from  'ramda';
import { toSafeNumber } from 'utils';

/**
 * Retrieve item entry total from the given rate, quantity and discount.
 * @param {number} rate
 * @param {number} quantity
 * @param {number} discount
 * @return {number}
 */
export const calcItemEntryTotal = (discount, quantity, rate) => {
  const _quantity = toSafeNumber(quantity);
  const _rate = toSafeNumber(rate);
  const _discount = toSafeNumber(discount);

  return _quantity * _rate - (_quantity * _rate * _discount) / 100;
};

/**
 * Updates the items entries total.
 */
export function updateItemsEntriesTotal(rows) {
  return rows.map((row) => ({
    ...row,
    amount: calcItemEntryTotal(row.discount, row.quantity, row.rate),
  }));
}

export const ITEM_TYPE = {
  SELLABLE: 'SELLABLE',
  PURCHASABLE: 'PURCHASABLE',
};

/**
 * Retrieve total of the given items entries.
 */
export function getEntriesTotal(entries) {
  return sumBy(entries, 'amount');
}

/**
 * Ensure the given entries have enough empty line on the last.
 * @param {Object} defaultEntry - Default entry.
 * @param {Array} entries - Entries.
 * @return {Array}
 */
export const ensureEntriesHaveEmptyLine = R.curry((defaultEntry, entries) => {
  const lastEntry = last(entries);

  if (isEmpty(lastEntry.account_id) || isEmpty(lastEntry.amount)) {
    return [...entries, defaultEntry];
  }
  return entries;
});