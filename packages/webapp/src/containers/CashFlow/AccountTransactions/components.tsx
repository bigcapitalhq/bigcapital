// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuItem, Tag } from '@blueprintjs/core';
import { FormatDateCell, Icon } from '@/components';
import { safeCallback } from '@/utils';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import FinancialLoadingBar from '@/containers/FinancialStatements/FinancialLoadingBar';

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
}) {
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

const allTransactionsStatusAccessor = (transaction) => {
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
      {transaction.formatted_status}
    </Tag>
  );
};

/**
 * Retrieve account transctions table columns.
 */
export function useAccountTransactionsColumns() {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: 'formatted_transaction_type',
        className: 'type',
        width: 140,
        textOverview: true,
        clickable: true,
      },
      {
        id: 'transaction_number',
        Header: 'Transaction #',
        accessor: 'transaction_number',
        width: 160,
        className: 'transaction_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'reference_number',
        Header: 'Ref.#',
        accessor: 'reference_number',
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
        accessor: 'formatted_deposit',
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
        accessor: 'formatted_withdrawal',
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
        accessor: 'formatted_running_balance',
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
