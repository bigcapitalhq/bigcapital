import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';

export type CashflowAccountRow = BankingAccountsListResponse[number];

interface CellProps {
  cell: { row: { original: CashflowAccountRow } };
}

interface RowProps {
  row: { original: CashflowAccountRow };
}

/**
 * Balance cell.
 */
export const BalanceCell = ({ cell }: CellProps) => {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>{account.formattedAmount}</span>
  ) : (
    <span className="placeholder">—</span>
  );
};

/**
 * Account cell.
 */
const AccountCell = ({ row }: RowProps) => {
  const account = row.original;
  return (
    <Link to={`/cashflow-accounts/${account.id}/transactions`}>
      {account.name}
    </Link>
  );
};

/**
 * Retrieve Cash flow table columns.
 */
export function useCashFlowAccountsTableColumns(): DataTableColumn<CashflowAccountRow>[] {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('account_name'),
        accessor: 'name',
        Cell: AccountCell,
        className: 'account_name',
        width: 200,
        textOverview: true,
      },
      {
        id: 'code',
        Header: intl.get('code'),
        accessor: 'code',
        className: 'code',
        width: 80,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: 'accountType',
        className: 'type',
        width: 140,
        textOverview: true,
      },
      {
        id: 'currency',
        Header: intl.get('currency'),
        accessor: 'currencyCode',
        width: 75,
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'amount',
        className: 'balance',
        Cell: BalanceCell,
        width: 150,
        align: 'right',
      },
    ],
    [],
  );
}
