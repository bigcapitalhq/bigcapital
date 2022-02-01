import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { useFormikContext } from 'formik';
import moment from 'moment';

import { transactionNumber, repeatValue } from 'utils';

export const defaultWareTransferEntry = {
  index: 0,
  item_id: '',
  source_warehouse: '100',
  destination_warehouse: '0',
  quantity: '',
};

export const MIN_LINES_NUMBER = 4;

export const defaultWarehouseTransfer = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  transaction_number: '',
  from_warehouse_id: '',
  to_warehouse_id: '',
  reason: '',
  entries: [...repeatValue(defaultWareTransferEntry, MIN_LINES_NUMBER)],
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
]);

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
