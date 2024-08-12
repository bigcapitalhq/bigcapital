import { useMemo } from 'react';
import intl from 'react-intl-universal';

/**
 * Retrieve account pending transctions table columns.
 */
export function usePendingTransactionsTableColumns() {
  return useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formatted_date',
        width: 40,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'description',
        Header: 'Description',
        accessor: 'description',
        width: 160,
        textOverview: true,
        clickable: true,
      },
      {
        id: 'payee',
        Header: 'Payee',
        accessor: 'payee',
        width: 60,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'reference_number',
        Header: 'Ref.#',
        accessor: 'reference_no',
        width: 50,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'deposit',
        Header: intl.get('cash_flow.label.deposit'),
        accessor: 'formatted_deposit_amount',
        width: 40,
        className: 'deposit',
        textOverview: true,
        align: 'right',
        clickable: true,
      },
      {
        id: 'withdrawal',
        Header: intl.get('cash_flow.label.withdrawal'),
        accessor: 'formatted_withdrawal_amount',
        className: 'withdrawal',
        width: 40,
        textOverview: true,
        align: 'right',
        clickable: true,
      },
    ],
    [],
  );
}
