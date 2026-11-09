import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useLayoutEffect } from 'react';
import intl from 'react-intl-universal';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  useEstimateIsForeignCustomer,
  type PaymentReceiveEntry,
  type PaymentReceiveFormValues,
} from './utils';
import { Money, ExchangeRateInputGroup, MoneyFieldCell } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber } from '@/utils';

type OnViewInvoiceDetail = (invoiceId: number) => void;

/**
 * Creates a click handler that opens the invoice detail drawer of the
 * given invoice.
 */
const createInvoiceClickHandler =
  (invoiceId: number, onViewInvoiceDetail?: OnViewInvoiceDetail) =>
  (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onViewInvoiceDetail?.(invoiceId);
  };

type InvoiceDateCellProps = {
  row: { original: PaymentReceiveEntry };
  value?: string | number | Date | null;
};

/**
 * Invoice date cell - renders the date as a link that opens the invoice
 * detail drawer when the row references an existing invoice.
 */
const createInvoiceDateCell = (onViewInvoiceDetail?: OnViewInvoiceDetail) => {
  return function InvoiceDateCell({
    row: { original },
    value,
  }: InvoiceDateCellProps) {
    const formattedDate = moment(value).format('YYYY MMM DD');

    if (!original?.invoiceId) {
      return <span>{formattedDate}</span>;
    }
    return (
      <a
        className={CLASSES.TEXT_LINK}
        onClick={createInvoiceClickHandler(
          original.invoiceId as number,
          onViewInvoiceDetail,
        )}
      >
        {formattedDate}
      </a>
    );
  };
};

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row: PaymentReceiveEntry): string {
  return row?.invoiceNo ? `#${row?.invoiceNo || ''}` : '-';
}

type InvoiceNumberCellProps = {
  row: { original: PaymentReceiveEntry };
  value: string;
};

/**
 * Invoice number cell - renders the invoice number as a link that opens
 * the invoice detail drawer when the row references an existing invoice.
 */
const createInvoiceNumberCell = (onViewInvoiceDetail?: OnViewInvoiceDetail) => {
  return function InvoiceNumberCell({
    row: { original },
    value,
  }: InvoiceNumberCellProps) {
    if (!original?.invoiceId) {
      return <span>{value}</span>;
    }
    return (
      <a
        className={CLASSES.TEXT_LINK}
        onClick={createInvoiceClickHandler(
          original.invoiceId as number,
          onViewInvoiceDetail,
        )}
      >
        {value}
      </a>
    );
  };
};

type MoneyTableCellProps = {
  row: { original: PaymentReceiveEntry };
  value: string | number;
};

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }: MoneyTableCellProps) {
  return <Money amount={value} currency={original.currencyCode} />;
}

/**
 * Retrieve payment receive form entries columns.
 */
export const usePaymentReceiveEntriesColumns = (
  onViewInvoiceDetail?: OnViewInvoiceDetail,
) => {
  return React.useMemo(
    () => [
      {
        Header: 'Invoice date',
        id: 'invoiceDate',
        accessor: 'invoiceDate',
        Cell: createInvoiceDateCell(onViewInvoiceDetail),
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        className: 'date',
      },
      {
        Header: intl.get('invocie_number'),
        accessor: InvNumberCellAccessor,
        Cell: createInvoiceNumberCell(onViewInvoiceDetail),
        disableSortBy: true,
        className: 'invoice_number',
      },
      {
        Header: intl.get('invoice_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 100,
        className: 'invoice_amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'dueAmount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
        className: 'amount_due',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'paymentAmount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 150,
        className: 'payment_amount',
      },
    ],
    [onViewInvoiceDetail],
  );
};

type ExchangeRateInputFieldProps = Omit<
  React.ComponentProps<typeof ExchangeRateInputGroup>,
  'fromCurrency' | 'toCurrency'
>;

/**
 * payment receive exchange rate input field.
 */
export function PaymentReceiveExchangeRateInputField({
  ...props
}: ExchangeRateInputFieldProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<PaymentReceiveFormValues>();

  const isForeignCustomer = useEstimateIsForeignCustomer();

  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currencyCode}
      toCurrency={baseCurrency ?? ''}
      {...props}
    />
  );
}

type SyncIncrementSettingsProps = Record<string, never>;

/**
 * Syncs the auto-increment settings to payment receive form.
 */
export const PaymentReceiveSyncIncrementSettingsToForm =
  ({}: SyncIncrementSettingsProps) => {
    const { paymentReceiveSettings } = usePaymentReceiveFormContext();
    const paymentReceiveNextNumber = paymentReceiveSettings?.nextNumber as
      | number
      | undefined;
    const paymentReceiveNumberPrefix = paymentReceiveSettings?.numberPrefix as
      | string
      | undefined;
    const paymentReceiveAutoIncrement =
      paymentReceiveSettings?.autoIncrement as boolean | undefined;
    const { setFieldValue } = useFormikContext<PaymentReceiveFormValues>();

    useLayoutEffect(() => {
      if (!paymentReceiveAutoIncrement) return;

      setFieldValue(
        'paymentReceiveNo',
        transactionNumber(paymentReceiveNumberPrefix, paymentReceiveNextNumber),
      );
    }, [
      setFieldValue,
      paymentReceiveNumberPrefix,
      paymentReceiveNextNumber,
      paymentReceiveAutoIncrement,
    ]);
    return null;
  };
