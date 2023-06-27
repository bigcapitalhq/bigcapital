// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { sumBy, isEmpty, last } from 'lodash';

import { useItem } from '@/hooks/query';
import {
  toSafeNumber,
  saveInvoke,
  compose,
  updateTableCell,
  updateAutoAddNewLine,
  orderingLinesIndexes,
  updateTableRow,
} from '@/utils';

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

/**
 * Disable landed cost checkbox once the item type is not service or non-inventory.
 * @returns {boolean}
 */
export const isLandedCostDisabled = (item) =>
  ['service', 'non-inventory'].indexOf(item.type) === -1;

/**
 * Handle fetch item row details and retrieves the new table row.
 */
export function useFetchItemRow({ landedCost, itemType, notifyNewRow }) {
  const [itemRow, setItemRow] = React.useState(null);
  const [cellsLoading, setCellsLoading] = React.useState(null);

  // Fetches the item details.
  const {
    data: item,
    isFetching: isItemFetching,
    isSuccess: isItemSuccess,
  } = useItem(itemRow && itemRow.itemId, {
    enabled: !!(itemRow && itemRow.itemId),
  });

  // Once the item start loading give the table cells loading state.
  React.useEffect(() => {
    if (itemRow && isItemFetching) {
      setCellsLoading([
        [itemRow.rowIndex, 'rate'],
        [itemRow.rowIndex, 'description'],
        [itemRow.rowIndex, 'quantity'],
        [itemRow.rowIndex, 'discount'],
      ]);
    } else {
      setCellsLoading(null);
    }
  }, [isItemFetching, setCellsLoading, itemRow]);

  // Once the item selected and fetched set the initial details to the table.
  React.useEffect(() => {
    if (isItemSuccess && item && itemRow) {
      const { rowIndex } = itemRow;
      const price =
        itemType === ITEM_TYPE.PURCHASABLE ? item.cost_price : item.sell_price;

      const description =
        itemType === ITEM_TYPE.PURCHASABLE
          ? item.purchase_description
          : item.sell_description;

      // Determines whether the landed cost checkbox should be disabled.
      const landedCostDisabled = isLandedCostDisabled(item);

      // The new row.
      const newRow = {
        rate: price,
        description,
        quantity: 1,
        ...(landedCost
          ? {
              landed_cost: false,
              landed_cost_disabled: landedCostDisabled,
            }
          : {}),
      };
      setItemRow(null);
      saveInvoke(notifyNewRow, newRow, rowIndex);
    }
  }, [item, itemRow, itemType, isItemSuccess, landedCost, notifyNewRow]);

  return {
    isItemFetching,
    isItemSuccess,
    item,
    setItemRow,
    itemRow,
    cellsLoading,
  };
}

/**
 * Compose table rows when edit specific row index of table rows.
 */
export const composeRowsOnEditCell = R.curry(
  (rowIndex, columnId, value, defaultEntry, rows) => {
    return compose(
      orderingLinesIndexes,
      updateAutoAddNewLine(defaultEntry, ['item_id']),
      updateItemsEntriesTotal,
      updateTableCell(rowIndex, columnId, value),
    )(rows);
  },
);

/**
 * Compose table rows when insert a new row to table rows.
 */
export const composeRowsOnNewRow = R.curry((rowIndex, newRow, rows) => {
  return compose(
    orderingLinesIndexes,
    updateItemsEntriesTotal,
    updateTableRow(rowIndex, newRow),
  )(rows);
});

/**
 *
 * @param {*} entries
 * @returns
 */
export const composeControlledEntries = (entries) => {
  return R.compose(orderingLinesIndexes, updateItemsEntriesTotal)(entries);
};
