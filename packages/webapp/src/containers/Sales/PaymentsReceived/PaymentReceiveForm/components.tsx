import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useLayoutEffect } from 'react';
import intl from 'react-intl-universal';
import {
  useEstimateIsForeignCustomer,
  type PaymentReceiveEntry,
  type PaymentReceiveFormValues,
} from './utils';
import { Money, ExchangeRateInputGroup, MoneyFieldCell } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber } from '@/utils';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';

type InvoiceDateCellProps = {
  value?: string | number | Date | null;
};

/**
 * Invoice date cell.
 */
function InvoiceDateCell({ value }: InvoiceDateCellProps) {
  return <span>{moment(value).format('YYYY MMM DD')}</span>;
}

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row: PaymentReceiveEntry): string {
  return row?.invoiceNo ? `#${row?.invoiceNo || ''}` : '-';
}

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
export const usePaymentReceiveEntriesColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: 'Invoice date',
        id: 'invoiceDate',
        accessor: 'invoiceDate',
        Cell: InvoiceDateCell,
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        className: 'date',
      },
      {
        Header: intl.get('invocie_number'),
        accessor: InvNumberCellAccessor,
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
    [],
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

type ProjectSelectButtonProps = {
  label?: string;
};

/**
 * payment receive project select.
 */
export function PaymentReceiveProjectSelectButton({
  label,
}: ProjectSelectButtonProps) {
  return <Button text={label ?? intl.get('select_project')} />;
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
