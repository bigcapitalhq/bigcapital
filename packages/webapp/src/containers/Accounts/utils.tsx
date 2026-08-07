import { Intent, Tag, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { NormalCell, BalanceCell, BankBalanceCell } from './components';
import type { AccountTableRow } from './components';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { Row } from 'react-table';
import { If, AppToaster } from '@/components';
import { transformTableStateToQuery, isBlank } from '@/utils';

export const DeleteAccountTypeError = {
  AccountPredefined: 'account_predefined',
  AccountHasAssociatedTransactions: 'account_has_associated_transactions',
};

interface DeleteError {
  type: string;
}

/**
 * Account name accessor.
 */
export const accountNameAccessor = (account: AccountTableRow) => {
  return (
    <span>
      <span className={'account-name'}>{account.name}</span>
      <If condition={!!account.description}>
        <span className={'account-desc'}>{account.description}</span>
      </If>
    </span>
  );
};

/**
 * Handle delete errors in bulk and singular.
 */
export const handleDeleteErrors = (errors: DeleteError[]) => {
  if (errors.find((e) => e.type === DeleteAccountTypeError.AccountPredefined)) {
    AppToaster.show({
      message: intl.get('cannot_delete_predefined_accounts'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (e) => e.type === DeleteAccountTypeError.AccountHasAssociatedTransactions,
    )
  ) {
    AppToaster.show({
      message: intl.get('cannot_delete_account_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }
};

export const AccountCodeAccessor = (row: AccountTableRow) =>
  !isBlank(row.code) ? (
    <Tag minimal round intent={Intent.NONE}>
      {row.code}
    </Tag>
  ) : null;

/**
 * Accounts table columns.
 */
export const useAccountsTableColumns =
  (): DataTableColumn<AccountTableRow>[] => {
    return React.useMemo(
      () =>
        [
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
            accessor: 'accountTypeLabel',
            className: clsx('type', Classes.TEXT_MUTED),
            width: 140,
            clickable: true,
            textOverview: true,
          },
          {
            id: 'normal',
            Header: intl.get('account_normal'),
            Cell: NormalCell,
            accessor: 'accountNormal',
            className: 'normal',
            width: 80,
            clickable: true,
          },
          {
            id: 'currency',
            Header: intl.get('currency'),
            accessor: 'currencyCode',
            className: clsx(Classes.TEXT_MUTED),
            width: 75,
            clickable: true,
          },
          {
            id: 'bank_balance',
            Header: 'Bank Balance',
            accessor: 'bankBalanceFormatted',
            Cell: BankBalanceCell,
            width: 150,
            clickable: true,
            align: 'right',
            money: true,
          },
          {
            id: 'balance',
            Header: intl.get('balance'),
            accessor: 'amount',
            Cell: BalanceCell,
            width: 150,
            clickable: true,
            money: true,
            align: 'right',
          },
        ] as DataTableColumn<AccountTableRow>[],
      [],
    );
  };

export const rowClassNames = (row: Row<AccountTableRow>) => ({
  inactive: !row.original.active,
});

/**
 * Transformes the table state to list query.
 */
export const transformAccountsStateToQuery = (
  tableState: Record<string, unknown>,
) => {
  return {
    ...transformTableStateToQuery(tableState),
    onlyInactive: tableState.inactiveMode,
  };
};
