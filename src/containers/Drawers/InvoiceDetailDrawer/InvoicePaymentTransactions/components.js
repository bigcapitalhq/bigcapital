import React from 'react';
import intl from 'react-intl-universal';

import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { FormattedMessage as T, FormatDateCell } from '../../../../components';

/**
 * Retrieve invoice payment transactions table columns.
 */
export const useInvoicePaymentTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('payment_date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'amount',
        // accessor: 'formatted_amount',
        align: 'right',
        width: 120,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'payment_receive_no.',
        Header: intl.get('payment_no'),
        accessor: 'payment_receive_no',
        width: 100,
        className: 'payment_receive_no',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
};
