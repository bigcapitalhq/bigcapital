import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { keyBy, omit } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type {
  WarehouseTransferEntry,
  WarehouseTransferFormValues,
} from './types';
import { AppToaster } from '@/components';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { useWatch } from '@/hooks/utils';
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

export const MIN_LINES_NUMBER = 1;

// Default warehouse transfer entry.
export const defaultWarehouseTransferEntry: WarehouseTransferEntry = {
  index: 0,
  itemId: '',
  sourceWarehouse: '',
  destinationWarehouse: '',
  description: '',
  quantity: '',
};

// Default warehouse transfer entry.
export const defaultWarehouseTransfer: WarehouseTransferFormValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  transactionNumber: '',
  fromWarehouseId: '',
  toWarehouseId: '',
  reason: '',
  transferInitiated: '',
  transferDelivered: '',
  entries: [...repeatValue(defaultWarehouseTransferEntry, MIN_LINES_NUMBER)],
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
]);

interface TransformError {
  type: string;
}

/**
 * Transform warehouse transfer to initial values in edit mode.
 */
export function transformToEditForm(
  warehouse: { entries?: unknown[] } & Record<string, unknown>,
): WarehouseTransferFormValues {
  const warehouseEntries =
    (warehouse.entries as WarehouseTransferEntry[]) ?? [];
  const initialEntries = [
    ...warehouseEntries.map((entry) => ({
      ...transformToForm(entry, defaultWarehouseTransferEntry),
    })),
    ...repeatValue(
      defaultWarehouseTransferEntry,
      Math.max(MIN_LINES_NUMBER - warehouseEntries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultWarehouseTransferEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(warehouse, defaultWarehouseTransfer),
    entries,
  } as WarehouseTransferFormValues;
}

/**
 * Syncs transfer no. settings with form.
 */
export const useObserveTransferNoSettings = (
  prefix: string,
  nextNumber: number,
) => {
  const { setFieldValue } = useFormikContext<WarehouseTransferFormValues>();

  React.useEffect(() => {
    const transferNo = transactionNumber(prefix, nextNumber);
    setFieldValue('transactionNumber', transferNo);
  }, [setFieldValue, prefix, nextNumber]);
};

interface EntriesFieldProps {
  items: unknown;
  formik: {
    values: WarehouseTransferFormValues;
  };
}

/**
 * Detarmines warehouse entries field when should update.
 */
export const entriesFieldShouldUpdate = (
  newProps: EntriesFieldProps,
  oldProps: EntriesFieldProps,
) => {
  return (
    newProps.items !== oldProps.items ||
    newProps.formik.values.fromWarehouseId !==
      oldProps.formik.values.fromWarehouseId ||
    newProps.formik.values.toWarehouseId !==
      oldProps.formik.values.toWarehouseId ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transformes the form values to request body values.
 */
export function transformValueToRequest(values: WarehouseTransferFormValues) {
  const entries = values.entries.filter((item) => item.itemId && item.quantity);
  return {
    ...values,
    entries: entries.map((entry) => ({
      ...omit(entry, [
        'warehouses',
        'destinationWarehouse',
        'sourceWarehouse',
        'cost',
      ]),
    })),
  };
}

/**
 * Transformes the response errors types.
 */
export const transformErrors = (
  errors: TransformError[],
  _opts: { setErrors: (errors: unknown) => void },
) => {
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
 */
export const mutateTableCell = R.curry(
  (
    rowIndex: number,
    columnId: string,
    defaultEntry: WarehouseTransferEntry,
    value: unknown,
    entries: WarehouseTransferEntry[],
  ): WarehouseTransferEntry[] => {
    return compose(
      // Update auto-adding new line.
      updateAutoAddNewLine(defaultEntry, ['itemId']),
      // Update the row value of the given row index and column id.
      updateTableCell(rowIndex, columnId, value),
    )(entries);
  },
);

/**
 * Compose table rows when insert a new row to table rows.
 */
export const mutateTableRow = R.curry(
  (
    rowIndex: number,
    newRow: WarehouseTransferEntry,
    rows: WarehouseTransferEntry[],
  ): WarehouseTransferEntry[] => {
    return compose(
      orderingLinesIndexes,
      updateTableRow(rowIndex, newRow),
    )(rows);
  },
);

/**
 * Deletes the table row from the given rows.
 */
export const deleteTableRow = R.curry(
  (
    rowIndex: number,
    defaultEntry: WarehouseTransferEntry,
    rows: WarehouseTransferEntry[],
  ): WarehouseTransferEntry[] => {
    return compose(
      // Ensure minimum lines count.
      updateMinEntriesLines(MIN_LINES_NUMBER, defaultEntry),
      // Remove the line by the given index.
      updateRemoveLineByIndex(rowIndex),
    )(rows);
  },
);

interface InventoryItemCost {
  itemId: number;
  average?: number;
}

/**
 * Watches the inventory items cost and sets the cost to form entries.
 */
export function useWatchItemsCostSetCostEntries() {
  const { isItemsCostSuccess, inventoryItemsCost } =
    useWarehouseTransferFormContext();

  const {
    setFieldValue,
    values: { entries },
  } = useFormikContext<WarehouseTransferFormValues>();

  // Transformes items cost map by item id.
  const itemsCostByItemId = React.useMemo(
    () => keyBy(inventoryItemsCost as InventoryItemCost[], 'itemId'),
    [inventoryItemsCost],
  );

  // Observes the inventory items cost and set form entries with cost.
  useWatch(() => {
    if (!isItemsCostSuccess) return;

    const newEntries = entries.map((entry) => {
      const costEntry = itemsCostByItemId[Number(entry.itemId)];

      return entry.itemId
        ? {
            ...entry,
            cost: costEntry?.average,
          }
        : entry;
    });
    setFieldValue('entries', newEntries);
  }, inventoryItemsCost);
}
