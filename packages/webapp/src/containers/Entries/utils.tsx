// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import * as R from 'ramda';
import { sumBy, isEmpty, last, keyBy, groupBy } from 'lodash';
import { useItem } from '@/hooks/query';
import {
  toSafeNumber,
  saveInvoke,
  compose,
  updateTableCell,
  updateAutoAddNewLine,
  updateMinEntriesLines,
  orderingLinesIndexes,
  updateTableRow,
  formattedAmount,
  updateRemoveLineByIndex,
} from '@/utils';
import { useItemEntriesTableContext } from './ItemEntriesTableProvider';

export const ITEM_TYPE = {
  SELLABLE: 'SELLABLE',
  PURCHASABLE: 'PURCHASABLE',
};

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
 * Disable landed cost checkbox once the item type is not service or non-inventorty.
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

      // Detarmines whether the landed cost checkbox should be disabled.
      const landedCostDisabled = isLandedCostDisabled(item);

      const taxRateId =
        itemType === ITEM_TYPE.PURCHASABLE
          ? item.purchase_tax_rate_id
          : item.sell_tax_rate_id;

      // The new row.
      const newRow = {
        rate: price,
        description,
        quantity: 1,
        tax_rate_id: taxRateId,
        ...(landedCost
          ? {
              landed_cost: false,
              landed_cost_disabled: landedCostDisabled,
            }
          : {}),
        taxRateId,
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
    return compose()(rows);
  },
);

/**
 * Compose table rows when insert a new row to table rows.
 */
export const useComposeRowsOnNewRow = () => {
  const { taxRates, isInclusiveTax } = useItemEntriesTableContext();

  return React.useMemo(() => {
    return R.curry((rowIndex, newRow, rows) => {
      return compose(
        assignEntriesTaxAmount(isInclusiveTax),
        assignEntriesTaxRate(taxRates),
        orderingLinesIndexes,
        updateItemsEntriesTotal,
        updateTableRow(rowIndex, newRow),
      )(rows);
    });
  }, [isInclusiveTax, taxRates]);
};

/**
 * Associate tax rate to entries.
 */
export const assignEntriesTaxRate = R.curry((taxRates, entries) => {
  const taxRatesById = keyBy(taxRates, 'id');

  return entries.map((entry) => {
    const taxRate = taxRatesById[entry.tax_rate_id];

    return {
      ...entry,
      tax_rate: taxRate?.rate || 0,
    };
  });
});

/**
 * Assign tax amount to entries.
 * @param {boolean} isInclusiveTax
 * @param entries
 * @returns
 */
export const assignEntriesTaxAmount = R.curry(
  (isInclusiveTax: boolean, entries) => {
    return entries.map((entry) => {
      const taxAmount = isInclusiveTax
        ? getInclusiveTaxAmount(entry.amount, entry.tax_rate)
        : getExlusiveTaxAmount(entry.amount, entry.tax_rate);

      return {
        ...entry,
        tax_amount: taxAmount,
      };
    });
  },
);

/**
 * Get inclusive tax amount.
 * @param {number} amount
 * @param {number} taxRate
 * @returns {number}
 */
export const getInclusiveTaxAmount = (amount: number, taxRate: number) => {
  return (amount * taxRate) / (100 + taxRate);
};

/**
 * Get exclusive tax amount.
 * @param {number} amount
 * @param {number} taxRate
 * @returns {number}
 */
export const getExlusiveTaxAmount = (amount: number, taxRate: number) => {
  return (amount * taxRate) / 100;
};

/**
 * Compose rows when edit a table cell.
 * @returns {Function}
 */
export const useComposeRowsOnEditTableCell = () => {
  const { taxRates, isInclusiveTax, localValue, defaultEntry } =
    useItemEntriesTableContext();

  return useCallback(
    (rowIndex, columnId, value) => {
      return R.compose(
        assignEntriesTaxAmount(isInclusiveTax),
        assignEntriesTaxRate(taxRates),
        orderingLinesIndexes,
        updateAutoAddNewLine(defaultEntry, ['item_id']),
        updateItemsEntriesTotal,
        updateTableCell(rowIndex, columnId, value),
      )(localValue);
    },
    [taxRates, isInclusiveTax, localValue, defaultEntry],
  );
};

/**
 * Compose rows when remove a table row.
 * @returns {Function}
 */
export const useComposeRowsOnRemoveTableRow = () => {
  const { minLinesNumber, defaultEntry, localValue } =
    useItemEntriesTableContext();

  return useCallback(
    (rowIndex) => {
      return compose(
        // Ensure minimum lines count.
        updateMinEntriesLines(minLinesNumber, defaultEntry),
        // Remove the line by the given index.
        updateRemoveLineByIndex(rowIndex),
      )(localValue);
    },
    [minLinesNumber, defaultEntry, localValue],
  );
};

/**
 * Retrieves the aggregate tax rates from the given item entries.
 * @param {string} currencyCode - 
 * @param {any} taxRates - 
 * @param {any} entries - 
 */
export const aggregateItemEntriesTaxRates = R.curry(
  (currencyCode, taxRates, entries) => {
    const taxRatesById = keyBy(taxRates, 'id');

    // Calculate the total tax amount of invoice entries.
    const filteredEntries = entries.filter((e) => e.tax_rate_id);
    const groupedTaxRates = groupBy(filteredEntries, 'tax_rate_id');

    return Object.keys(groupedTaxRates).map((taxRateId) => {
      const taxRate = taxRatesById[taxRateId];
      const taxRates = groupedTaxRates[taxRateId];
      const totalTaxAmount = sumBy(taxRates, 'tax_amount');
      const taxAmountFormatted = formattedAmount(totalTaxAmount, currencyCode);

      return {
        taxRateId,
        taxRate: taxRate.rate,
        label: `${taxRate.name} [${taxRate.rate}%]`,
        taxAmount: totalTaxAmount,
        taxAmountFormatted,
      };
    });
  },
);
