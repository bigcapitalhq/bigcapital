import React from 'react';
import { Intent } from '@blueprintjs/core';
import { If, AppToaster } from 'components';
import { formatMessage } from 'services/intl';
import { NormalCell, BalanceCell, ActionsCell } from './components';

/**
 * Account name accessor.
 */
export const accountNameAccessor = (account) => {
  return (
    <span>
      <span class={'account-name'}>{account.name}</span>
      <If condition={account.description}>
        <span class={'account-desc'}>{account.description}</span>
      </If>
    </span>
  );
};

/**
 * Handle delete errors in bulk and singular.
 */
export const handleDeleteErrors = (errors) => {
  if (errors.find((e) => e.type === 'ACCOUNT.PREDEFINED')) {
    AppToaster.show({
      message: formatMessage({
        id: 'you_could_not_delete_predefined_accounts',
      }),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((e) => e.type === 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS')) {
    AppToaster.show({
      message: formatMessage({
        id: 'cannot_delete_account_has_associated_transactions',
      }),
      intent: Intent.DANGER,
    });
  }
};

/**
 * Accounts table columns.
 */
export const useAccountsTableColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'account_name',
        width: 200,
      },
      {
        id: 'code',
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        width: 80,
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: 'account_type_label',
        className: 'type',
        width: 140,
      },
      {
        id: 'normal',
        Header: formatMessage({ id: 'normal' }),
        Cell: NormalCell,
        accessor: 'account_normal',
        className: 'normal',
        width: 80,
      },
      {
        id: 'currency',
        Header: formatMessage({ id: 'currency' }),
        accessor: (row) => 'USD',
        width: 75,
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: 'amount',
        Cell: BalanceCell,
        width: 150,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        skeletonWidthMin: 100,
      },
    ],
    [],
  )
}

export const rowClassNames = (row) => ({
  inactive: !row.original.active,
});