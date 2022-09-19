// @ts-nocheck
import React from 'react';

import intl from 'react-intl-universal';
import { Intent, Tag } from '@blueprintjs/core';
import { isBlank } from '@/utils';
import { Link } from 'react-router-dom';

/**
 * Account code accessor.
 */
export const AccountCodeAccessor = (row) =>
  !isBlank(row.code) ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {row.code}
    </Tag>
  ) : null;

/**
 * Balance cell.
 */
export const BalanceCell = ({ cell }) => {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>{account.formatted_amount}</span>
  ) : (
    <span class="placeholder">—</span>
  );
};

/**
 * Account cell.
 */
const AccountCell = ({ row }) => {
  const account = row.original;
  return (
    <>
      <div>X</div>
      <Link to={`/account/${account.id}/transactions`}>{account.name}</Link>
    </>
  );
};

/**
 * Retrieve Cash flow table columns.
 */
export function useCashFlowAccountsTableColumns() {
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
        accessor: 'account_type_label',
        className: 'type',
        width: 140,
        textOverview: true,
      },
      {
        id: 'currency',
        Header: intl.get('currency'),
        accessor: 'currency_code',
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
