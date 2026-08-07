import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import {
  usePaymentMadeIsForeignCustomer,
  type PaymentMadeFormValues,
} from './utils';
import { Money, ExchangeRateInputGroup } from '@/components';
import { MoneyFieldCell } from '@/components/DataTableCells';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

type Row = {
  billNo?: string;
  currencyCode?: string;
};

function BillNumberAccessor(row: Row): string {
  return row?.billNo ? row?.billNo : '-';
}

function BillDateCell({ value }: { value: string }) {
  return <span>{moment(value).format('YYYY MMM DD')}</span>;
}

/**
 * Money table cell.
 */
function MoneyTableCell({
  row: { original },
  value,
}: {
  row: { original: Row };
  value: string | number;
}) {
  return <Money amount={value} currency={original.currencyCode} />;
}

/**
 * Payment made entries table columns
 */
export function usePaymentMadeEntriesTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: 'Bill date',
        id: 'billDate',
        accessor: 'billDate',
        Cell: BillDateCell,
        disableSortBy: true,
        width: 120,
      },
      {
        Header: intl.get('bill_number'),
        accessor: BillNumberAccessor,
        disableSortBy: true,
        width: 120,
      },
      {
        Header: intl.get('bill_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'dueAmount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'paymentAmount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 150,
      },
    ],
    [],
  );
}

type ExchangeRateInputFieldProps = Omit<
  React.ComponentProps<typeof ExchangeRateInputGroup>,
  'fromCurrency' | 'toCurrency'
> & { name?: string; formGroupProps?: { label: string; inline: boolean } };

/**
 * Payment made exchange rate input field.
 */
export function PaymentMadeExchangeRateInputField(
  props: ExchangeRateInputFieldProps,
) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<PaymentMadeFormValues>();

  const isForeignCustomer = usePaymentMadeIsForeignCustomer();

  // Can't continue if the customer is not foreign.
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
