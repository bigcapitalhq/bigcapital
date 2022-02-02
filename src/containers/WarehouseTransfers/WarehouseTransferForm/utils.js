import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { AppToaster } from 'components';
import { omit } from 'lodash';

import {
  compose,
  transformToForm,
  repeatValue,
  transactionNumber,
  defaultFastFieldShouldUpdate,
} from 'utils';

// import { defaultFastFieldShouldUpdate } from 'utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';

export const MIN_LINES_NUMBER = 4;

// Default warehouse transfer entry.
export const defaultWarehouseTransferEntry = {
  index: 0,
  item_id: '',
  source_warehouse: '100',
  destination_warehouse: '0',
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
 * Detarmines warehouse entries field when should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transformes the form values to request body values.
 */
export function transformValueToRequest(values) {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  return {
    ...values,
    entries: entries.map((entry) => ({
      ...omit(entry, ['destination_warehouse', 'source_warehouse']),
    })),
  };
}

/**
 * Transformes the response errors types.
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
