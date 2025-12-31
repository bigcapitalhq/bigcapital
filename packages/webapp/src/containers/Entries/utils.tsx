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

      // Convert single taxRateId to array format
      const taxRateIds = taxRateId ? [taxRateId] : [];

      // The new row.
      const newRow = {
        rate: price,
        description,
        quantity: 1,
        tax_rate_ids: taxRateIds,
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
 * Associate tax rates to entries using tax_rate_ids array.
 */
export const assignEntriesTaxRate = R.curry((taxRates, entries) => {
  const taxRatesById = keyBy(taxRates, 'id');

  return entries.map((entry) => {
    const taxRateIds = entry.tax_rate_ids || [];

    // Get all tax rate objects for the selected IDs
    const selectedTaxRates = taxRateIds
      .map((id) => taxRatesById[id])
      .filter(Boolean);

    // Calculate combined tax rate (sum of all rates) for display purposes
    const combinedTaxRate = selectedTaxRates.reduce(
      (sum, tr) => sum + (tr?.rate || 0),
      0,
    );

    return {
      ...entry,
      tax_rate: combinedTaxRate,
      tax_rates_details: selectedTaxRates,
    };
  });
});

/**
 * Calculate taxes for multiple tax rates with compound support.
 * @param {number} amount - Base amount
 * @param {Array} taxRatesDetails - Array of tax rate objects
 * @param {boolean} isInclusiveTax - Whether taxes are inclusive
 * @returns {Object} - { totalTaxAmount, taxBreakdown }
 */
const calculateMultipleTaxes = (amount, taxRatesDetails, isInclusiveTax) => {
  if (!taxRatesDetails || taxRatesDetails.length === 0 || !amount) {
    return { totalTaxAmount: 0, taxBreakdown: [] };
  }

  // Sort taxes: non-compound first, then compound
  const sortedTaxes = [...taxRatesDetails].sort((a, b) => {
    if (a.is_compound === b.is_compound) return 0;
    return a.is_compound ? 1 : -1;
  });

  const taxBreakdown = [];
  let runningTotal = amount;
  let totalNonCompoundTax = 0;

  for (const tax of sortedTaxes) {
    let taxAmount;

    if (isInclusiveTax) {
      // For inclusive tax, compound taxes are calculated on amount + non-compound taxes
      const taxableAmount = tax.is_compound
        ? amount + totalNonCompoundTax
        : amount;
      taxAmount = getInclusiveTaxAmount(taxableAmount, tax.rate);
    } else {
      // For exclusive tax, compound taxes are calculated on amount + previous taxes
      const taxableAmount = tax.is_compound ? runningTotal : amount;
      taxAmount = getExlusiveTaxAmount(taxableAmount, tax.rate);
    }

    taxBreakdown.push({
      taxRateId: tax.id,
      taxRate: tax.rate,
      taxAmount,
      name: tax.name,
      code: tax.code,
      isCompound: tax.is_compound,
    });

    if (!tax.is_compound) {
      totalNonCompoundTax += taxAmount;
    }

    if (!isInclusiveTax) {
      runningTotal += taxAmount;
    }
  }

  const totalTaxAmount = taxBreakdown.reduce((sum, t) => sum + t.taxAmount, 0);

  return { totalTaxAmount, taxBreakdown };
};

/**
 * Assign tax amount to entries.
 * Supports multiple taxes with compound tax calculation.
 * @param {boolean} isInclusiveTax
 * @param entries
 * @returns
 */
export const assignEntriesTaxAmount = R.curry(
  (isInclusiveTax: boolean, entries) => {
    return entries.map((entry) => {
      const taxRatesDetails = entry.tax_rates_details || [];

      const { totalTaxAmount, taxBreakdown } = calculateMultipleTaxes(
        entry.amount,
        taxRatesDetails,
        isInclusiveTax,
      );

      return {
        ...entry,
        tax_amount: totalTaxAmount,
        tax_breakdown: taxBreakdown,
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
 * Uses pre-calculated tax_breakdown from entries.
 * @param {string} currencyCode -
 * @param {any} taxRates -
 * @param {any} entries -
 */
export const aggregateItemEntriesTaxRates = R.curry(
  (currencyCode, taxRates, entries) => {
    const aggregatedTaxes = {};

    entries.forEach((entry) => {
      const taxBreakdown = entry.tax_breakdown || [];

      taxBreakdown.forEach((taxItem) => {
        if (!aggregatedTaxes[taxItem.taxRateId]) {
          aggregatedTaxes[taxItem.taxRateId] = {
            taxRateId: taxItem.taxRateId,
            taxRate: taxItem.taxRate,
            name: taxItem.name,
            label: `${taxItem.name} [${taxItem.taxRate}%]`,
            taxAmount: 0,
          };
        }
        aggregatedTaxes[taxItem.taxRateId].taxAmount += taxItem.taxAmount;
      });
    });

    return Object.values(aggregatedTaxes).map((tax: any) => ({
      ...tax,
      taxAmountFormatted: formattedAmount(tax.taxAmount, currencyCode),
    }));
  },
);
