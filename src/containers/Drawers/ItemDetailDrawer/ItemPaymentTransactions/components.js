import React from 'react';
import intl from 'react-intl-universal';

import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';
import { FormatDateCell } from '../../../../components';

/**
 * Retrieve invoice payment transactions associated with item table columns.
 */
export const useInvoicePaymentTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: intl.get('date'),
        accessor: 'formatted_invoice_date',
        Cell: FormatDateCell,
        width: 140,
        className: 'invoice_date',
        textOverview: true,
      },
      {
        id: 'invoice_no',
        Header: intl.get('invoice_no__'),
        accessor: 'invoice_number',
        width: 120,
        className: 'invoice_no',
        textOverview: true,
      },
      // {
      //   id: 'reference_number',
      //   Header: intl.get('reference_no'),
      //   accessor: 'reference_number',
      //   width: 120,
      //   className: 'reference_number',
      //   textOverview: true,
      // },
      {
        id: 'qunatity',
        Header: 'Quantity Sold',
        accessor: 'quantity',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formatted_rate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};

/**
 * Retrieve estimate transactions associated with item table columns.
 */
export const useEstimateTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: intl.get('date'),
        accessor: 'formatted_estimate_date',
        Cell: FormatDateCell,
        width: 140,
        className: 'estimate_date',
        textOverview: true,
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_no'),
        accessor: 'estimate_number',
        width: 120,
        className: 'estimate_number',
        textOverview: true,
      },
      {
        id: 'qunatity',
        Header: 'Quantity Sold',
        accessor: 'quantity',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formatted_rate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};

/**
 * Retrieve receipt transactions associated with item table columns.
 */
export const useReceiptTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: intl.get('date'),
        accessor: 'formatted_receipt_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'receipt_date',
        textOverview: true,
      },
      {
        id: 'receipt_number',
        Header: intl.get('receipt_no'),
        accessor: 'receip_number',
        width: 140,
        className: 'receipt_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'reference_number',
        Header: intl.get('reference_no'),
        accessor: 'reference_number',
        width: 140,
        className: 'reference_number',
        textOverview: true,
      },
      {
        id: 'qunatity',
        Header: 'Quantity Sold',
        accessor: 'quantity',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formatted_rate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};

/**
 * Retrieve bill transactions associated with item table columns.
 */
export const useBillTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: intl.get('date'),
        accessor: 'formatted_bill_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'bill_date',
      },
      {
        id: 'bill_number',
        Header: intl.get('bill_number'),
        accessor: (row) => (row.bill_number ? `${row.bill_number}` : null),
        width: 100,
        className: 'bill_number',
      },
      {
        id: 'reference_number',
        Header: intl.get('reference_no'),
        accessor: 'reference_number',
        width: 140,
        className: 'reference_number',
        textOverview: true,
      },
      {
        id: 'qunatity',
        Header: 'Quantity Sold',
        accessor: 'quantity',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formatted_rate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};
