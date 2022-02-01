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
  transfer_number: '',
  from_warehouse: '',
  to_warehouse: '',
  reason: '',
  entries: [...repeatValue(defaultWareTransferEntry, MIN_LINES_NUMBER)],
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  {
    index: 1,
    fieldKey: 'sellable',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
  {
    index: 2,
    fieldKey: 'active',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
]);

/**
 * Syncs transfer no. settings with form.
 */
export const useObserveTransferNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const transferNo = transactionNumber(prefix, nextNumber);
    setFieldValue('transfer_no', transferNo);
  }, [setFieldValue, prefix, nextNumber]);
};
