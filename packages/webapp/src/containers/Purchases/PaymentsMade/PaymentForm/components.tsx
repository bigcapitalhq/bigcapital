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
import { CLASSES } from '@/constants/classes';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

type Row = {
  billId?: string | number;
  billNo?: string;
  currencyCode?: string;
};

type OnViewBillDetail = (billId: number) => void;

/**
 * Creates a click handler that opens the bill detail drawer of the
 * given bill.
 */
const createBillClickHandler =
  (billId: number, onViewBillDetail?: OnViewBillDetail) =>
  (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onViewBillDetail?.(billId);
  };

function BillNumberAccessor(row: Row): string {
  return row?.billNo ? row?.billNo : '-';
}

type BillDateCellProps = {
  row: { original: Row };
  value: string;
};

/**
 * Bill date cell - renders the date as a link that opens the bill detail
 * drawer when the row references an existing bill.
 */
const createBillDateCell = (onViewBillDetail?: OnViewBillDetail) => {
  return function BillDateCell({
    row: { original },
    value,
  }: BillDateCellProps) {
    const formattedDate = moment(value).format('YYYY MMM DD');

    if (!original?.billId) {
      return <span>{formattedDate}</span>;
    }
    return (
      <a
        className={CLASSES.TEXT_LINK}
        onClick={createBillClickHandler(
          original.billId as number,
          onViewBillDetail,
        )}
      >
        {formattedDate}
      </a>
    );
  };
};

type BillNumberCellProps = {
  row: { original: Row };
  value: string;
};

/**
 * Bill number cell - renders the bill number as a link that opens the
 * bill detail drawer when the row references an existing bill.
 */
const createBillNumberCell = (onViewBillDetail?: OnViewBillDetail) => {
  return function BillNumberCell({
    row: { original },
    value,
  }: BillNumberCellProps) {
    if (!original?.billId) {
      return <span>{value}</span>;
    }
    return (
      <a
        className={CLASSES.TEXT_LINK}
        onClick={createBillClickHandler(
          original.billId as number,
          onViewBillDetail,
        )}
      >
        {value}
      </a>
    );
  };
};

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
export function usePaymentMadeEntriesTableColumns(
  onViewBillDetail?: OnViewBillDetail,
) {
  return React.useMemo(
    () => [
      {
        Header: 'Bill date',
        id: 'billDate',
        accessor: 'billDate',
        Cell: createBillDateCell(onViewBillDetail),
        disableSortBy: true,
        width: 120,
      },
      {
        Header: intl.get('bill_number'),
        accessor: BillNumberAccessor,
        Cell: createBillNumberCell(onViewBillDetail),
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
    [onViewBillDetail],
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
