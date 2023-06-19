// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { keyBy, omit } from 'lodash';
import { useFormikContext } from 'formik';

import { useWatch } from '@/hooks/utils';
import { AppToaster } from '@/components';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import {
  compose,
  transformToForm,
  repeatValue,
  transactionNumber,
  defaultFastFieldShouldUpdate,
  updateTableRow,
  updateMinEntriesLines,
  updateRemoveLineByIndex,
  orderingLinesIndexes,
  updateAutoAddNewLine,
  updateTableCell,
} from '@/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';

export const MIN_LINES_NUMBER = 1;

// Default warehouse transfer entry.
export const defaultWarehouseTransferEntry = {
  index: 0,
  item_id: '',
  source_warehouse: '',
  destination_warehouse: '',
  description: '',
  quantity: '',
};

// Default warehouse transfer entry.
export const defaultWarehouseTransfer = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  transaction_number: '',
  from_warehouse_id: '',
  to_warehouse_id: '',
  reason: '',
  transfer_initiated: '',
  transfer_delivered: '',
  entries: [...repeatValue(defaultWarehouseTransferEntry, MIN_LINES_NUMBER)],
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
]);

/**
 * Transform warehouse transfer to initial values in edit mode.
 */
export function transformToEditForm(warehouse) {
  const initialEntries = [
    ...warehouse.entries.map((warehouse) => ({
      ...transformToForm(warehouse, defaultWarehouseTransferEntry),
    })),
    ...repeatValue(
      defaultWarehouseTransferEntry,
      Math.max(MIN_LINES_NUMBER - warehouse.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultWarehouseTransferEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(warehouse, defaultWarehouseTransfer),
    entries,
  };
}

/**
 * Syncs transfer no. settings with form.
 */
export const useObserveTransferNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const transferNo = transactionNumber(prefix, nextNumber);
    setFieldValue('transaction_number', transferNo);
  }, [setFieldValue, prefix, nextNumber]);
};

/**
 * Determines warehouse entries field when should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    newProps.formik.values.from_warehouse_id !==
      oldProps.formik.values.from_warehouse_id ||
    newProps.formik.values.to_warehouse_id !==
      oldProps.formik.values.to_warehouse_id ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transforms the form values to request body values.
 */
export function transformValueToRequest(values) {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...values,
    entries: entries.map((entry) => ({
      ...omit(entry, [
        'warehouses',
        'destination_warehouse',
        'source_warehouse',
        'cost',
      ]),
    })),
  };
}

/**
 * Transforms the response errors types.
 */
export const transformErrors = (errors, { setErrors }) => {
  if (
    errors.some(({ type }) => type === 'WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME')
  ) {
    AppToaster.show({
      message: intl.get(
        'warehouse_transfer.error.could_not_transfer_item_from_source_to_destination',
      ),
      intent: Intent.DANGER,
    });
  }
};

/**
 * Mutates table cell.
 * @param {*} rowIndex
 * @param {*} columnId
 * @param {*} defaultEntry
 * @param {*} value
 * @param {*} entries
 * @returns
 */
export const mutateTableCell = R.curry(
  (rowIndex, columnId, defaultEntry, value, entries) => {
    return compose(
      // Update auto-adding new line.
      updateAutoAddNewLine(defaultEntry, ['item_id']),
      // Update the row value of the given row index and column id.
      updateTableCell(rowIndex, columnId, value),
    )(entries);
  },
);

/**
 * Compose table rows when insert a new row to table rows.
 */
export const mutateTableRow = R.curry((rowIndex, newRow, rows) => {
  return compose(orderingLinesIndexes, updateTableRow(rowIndex, newRow))(rows);
});

/**
 * Deletes the table row from the given rows.
 */
export const deleteTableRow = R.curry((rowIndex, defaultEntry, rows) => {
  return compose(
    // Ensure minimum lines count.
    updateMinEntriesLines(MIN_LINES_NUMBER, defaultEntry),
    // Remove the line by the given index.
    updateRemoveLineByIndex(rowIndex),
  )(rows);
});

/**
 * Watches the inventory items cost and sets the cost to form entries.
 */
export function useWatchItemsCostSetCostEntries() {
  const { isItemsCostSuccess, inventoryItemsCost } =
    useWarehouseTransferFormContext();

  const {
    setFieldValue,
    values: { entries },
  } = useFormikContext();

  // Transforms items cost map by item id.
  const itemsCostByItemId = React.useMemo(
    () => keyBy(inventoryItemsCost, 'item_id'),
    [inventoryItemsCost],
  );

  // Observes the inventory items cost and set form entries with cost.
  useWatch(() => {
    if (!isItemsCostSuccess) return;

    const newEntries = entries.map((entry) => {
      const costEntry = itemsCostByItemId[entry.item_id];

      return entry.item_id
        ? {
            ...entry,
            cost: costEntry?.average,
          }
        : entry;
    });
    setFieldValue('entries', newEntries);
  }, inventoryItemsCost);
}
