import { Intent, Menu, MenuItem, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BankingTransactionResponse } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { FinancialLoadingBar } from '@/containers/FinancialStatements/FinancialLoadingBar';
import { safeCallback } from '@/utils';

export type AccountTransactionRow = BankingTransactionResponse;

interface ActionsMenuPayload {
  onUncategorize: (row: AccountTransactionRow) => void;
  onUnmatch: (row: AccountTransactionRow) => void;
}

interface ActionsMenuProps {
  row: { original: AccountTransactionRow };
  payload: ActionsMenuPayload;
}

export function AccountTransactionsLoadingBar() {
  const {
    isBankAccountMetaSummaryFetching,
    isCurrentAccountFetching,
    isCashFlowAccountsFetching,
  } = useAccountTransactionsContext();

  const isLoading =
    isCashFlowAccountsFetching ||
    isCurrentAccountFetching ||
    isBankAccountMetaSummaryFetching;

  if (isLoading) {
    return <FinancialLoadingBar />;
  }
  return null;
}

export function ActionsMenu({
  payload: { onUncategorize, onUnmatch },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      {original.status === 'categorized' && (
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={'Uncategorize'}
          onClick={safeCallback(onUncategorize, original)}
        />
      )}
      {original.status === 'matched' && (
        <MenuItem
          text={'Unmatch'}
          icon={<Icon icon="unlink" iconSize={16} />}
          onClick={safeCallback(onUnmatch, original)}
        />
      )}
    </Menu>
  );
}

const allTransactionsStatusAccessor = (transaction: AccountTransactionRow) => {
  return (
    <Tag
      intent={
        transaction.status === 'categorized'
          ? Intent.SUCCESS
          : transaction.status === 'matched'
            ? Intent.SUCCESS
            : Intent.NONE
      }
      minimal={transaction.status === 'manual'}
    >
      {transaction.formattedStatus}
    </Tag>
  );
};

/**
 * Retrieve account transctions table columns.
 */
export function useAccountTransactionsColumns(): DataTableColumn<AccountTransactionRow>[] {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formattedDate',
        width: 110,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: 'formattedTransactionType',
        className: 'type',
        width: 140,
        textOverview: true,
        clickable: true,
      },
      {
        id: 'transaction_number',
        Header: 'Transaction #',
        accessor: 'transactionNumber',
        width: 160,
        className: 'transaction_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'reference_number',
        Header: 'Ref.#',
        accessor: 'referenceNumber',
        width: 160,
        className: 'reference_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: allTransactionsStatusAccessor,
      },
      {
        id: 'deposit',
        Header: intl.get('banking.label.deposit'),
        accessor: 'formattedDeposit',
        width: 110,
        className: 'deposit',
        textOverview: true,
        align: 'right',
        clickable: true,
        money: true,
      },
      {
        id: 'withdrawal',
        Header: intl.get('banking.label.withdrawal'),
        accessor: 'formattedWithdrawal',
        className: 'withdrawal',
        width: 150,
        textOverview: true,
        align: 'right',
        clickable: true,
        money: true,
      },
      {
        id: 'running_balance',
        Header: intl.get('banking.label.running_balance'),
        accessor: 'formattedRunningBalance',
        className: 'running_balance',
        align: 'right',
        width: 150,
        textOverview: true,
        clickable: true,
        money: true,
      },
    ],
    [],
  );
}
