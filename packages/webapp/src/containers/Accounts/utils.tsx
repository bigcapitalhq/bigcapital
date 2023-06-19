// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Tag } from '@blueprintjs/core';

import { If, AppToaster } from '@/components';
import { NormalCell, BalanceCell } from './components';
import { transformTableStateToQuery, isBlank } from '@/utils';

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
      message: intl.get('you_could_not_delete_predefined_accounts'),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((e) => e.type === 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS')) {
    AppToaster.show({
      message: intl.get('cannot_delete_account_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }
};

export const AccountCodeAccessor = (row) =>
  !isBlank(row.code) ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {row.code}
    </Tag>
  ) : null;

/**
 * Accounts table columns.
 */
export const useAccountsTableColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('account_name'),
        accessor: 'name',
        className: 'account_name',
        width: 200,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'code',
        Header: intl.get('code'),
        accessor: AccountCodeAccessor,
        className: 'code',
        width: 80,
        clickable: true,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: 'account_type_label',
        className: 'type',
        width: 140,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'normal',
        Header: intl.get('account_normal'),
        Cell: NormalCell,
        accessor: 'account_normal',
        className: 'normal',
        width: 80,
        clickable: true,
      },
      {
        id: 'currency',
        Header: intl.get('currency'),
        accessor: 'currency_code',
        width: 75,
        clickable: true,
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'amount',
        Cell: BalanceCell,
        width: 150,
        clickable: true,
        align: 'right',
      },
    ],
    [],
  );
};

export const rowClassNames = (row) => ({
  inactive: !row.original.active,
});

/**
 * Transforms the table state to list query.
 */
export const transformAccountsStateToQuery = (tableState) => {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  }
}