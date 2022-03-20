import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Money, ExchangeRateInputGroup } from 'components';
import { safeSumBy, formattedAmount } from 'utils';
import { MoneyFieldCell } from 'components/DataTableCells';
import { useFormikContext } from 'formik';
import { useCurrentOrganization } from 'hooks/state';
import { usePaymentMadeIsForeignCustomer } from './utils';

function BillNumberAccessor(row) {
  return row?.bill_no ? row?.bill_no : '-';
}

function IndexTableCell({ row: { index } }) {
  return <span>{index + 1}</span>;
}

function BillDateCell({ value }) {
  return moment(value).format('YYYY MMM DD');
}
/**
 * Balance footer cell.
 */
function AmountFooterCell({ payload: { currencyCode }, rows }) {
  const total = safeSumBy(rows, 'original.amount');
  return <span>{formattedAmount(total, currencyCode)}</span>;
}

/**
 * Due amount footer cell.
 */
function DueAmountFooterCell({ payload: { currencyCode }, rows }) {
  const totalDueAmount = safeSumBy(rows, 'original.due_amount');
  return <span>{formattedAmount(totalDueAmount, currencyCode)}</span>;
}

/**
 * Payment amount footer cell.
 */
function PaymentAmountFooterCell({ payload: { currencyCode }, rows }) {
  const totalPaymentAmount = safeSumBy(rows, 'original.payment_amount');
  return <span>{formattedAmount(totalPaymentAmount, currencyCode)}</span>;
}

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }) {
  return <Money amount={value} currency={original.currency_code} />;
}

/**
 * Payment made entries table columns
 */
export function usePaymentMadeEntriesTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: IndexTableCell,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
        className: 'index',
      },
      {
        Header: intl.get('Date'),
        id: 'bill_date',
        accessor: 'bill_date',
        Cell: BillDateCell,
        disableSortBy: true,
        width: 250,
        className: 'bill_date',
      },
      {
        Header: intl.get('bill_number'),
        accessor: BillNumberAccessor,
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: intl.get('bill_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        Footer: AmountFooterCell,
        disableSortBy: true,
        className: 'amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'due_amount',
        Cell: MoneyTableCell,
        Footer: DueAmountFooterCell,
        disableSortBy: true,
        className: 'due_amount',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        Footer: PaymentAmountFooterCell,
        disableSortBy: true,
        className: 'payment_amount',
      },
    ],
    [],
  );
}

/**
 * payment made exchange rate input field.
 * @returns {JSX.Element}
 */
export function PaymentMadeExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = usePaymentMadeIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}
