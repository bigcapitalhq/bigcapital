// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Intent,
  Menu,
  MenuItem,
  MenuDivider,
  Tag,
  Popover,
  PopoverInteractionKind,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import {
  Box,
  Can,
  FormatDateCell,
  Icon,
  MaterialProgressBar,
} from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { safeCallback } from '@/utils';

export function ActionsMenu({
  payload: { onCategorize, onExclude },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={'Categorize'}
        onClick={safeCallback(onCategorize, original)}
      />
      <MenuDivider />
      <MenuItem
        text={'Exclude'}
        onClick={safeCallback(onExclude, original)}
        icon={<Icon icon="disable" iconSize={16} />}
      />
    </Menu>
  );
}

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
        Header: intl.get('transaction_number'),
        accessor: 'transaction_number',
        width: 160,
        className: 'transaction_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'reference_number',
        Header: intl.get('reference_no'),
        accessor: 'reference_number',
        width: 160,
        className: 'reference_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'deposit',
        Header: intl.get('cash_flow.label.deposit'),
        accessor: 'formatted_deposit',
        width: 110,
        className: 'deposit',
        textOverview: true,
        align: 'right',
        clickable: true,
      },
      {
        id: 'withdrawal',
        Header: intl.get('cash_flow.label.withdrawal'),
        accessor: 'formatted_withdrawal',
        className: 'withdrawal',
        width: 150,
        textOverview: true,
        align: 'right',
        clickable: true,
      },
      {
        id: 'running_balance',
        Header: intl.get('cash_flow.label.running_balance'),
        accessor: 'formatted_running_balance',
        className: 'running_balance',
        width: 150,
        textOverview: true,
        align: 'right',
        clickable: true,
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'formatted_balance',
        className: 'balance',
        width: 150,
        textOverview: true,
        clickable: true,
        align: 'right',
      },
    ],
    [],
  );
}

/**
 * Account transactions progress bar.
 */
export function AccountTransactionsProgressBar() {
  const { isCashFlowTransactionsFetching, isUncategorizedTransactionFetching } =
    useAccountTransactionsContext();

  return isCashFlowTransactionsFetching ||
    isUncategorizedTransactionFetching ? (
    <MaterialProgressBar />
  ) : null;
}

function statusAccessor(transaction) {
  return transaction.is_recognized ? (
    <Tooltip
      compact
      interactionKind={PopoverInteractionKind.HOVER}
      position={Position.RIGHT}
      content={
        <Box>
          <span>{transaction.assigned_category_formatted}</span>
          <Icon
            icon={'arrowRight'}
            color={'#8F99A8'}
            iconSize={12}
            style={{ marginLeft: 8, marginRight: 8 }}
          />
          <span>{transaction.assigned_account_name}</span>
        </Box>
      }
    >
      <Box>
        <Tag intent={Intent.SUCCESS} interactive>
          Recognized
        </Tag>
      </Box>
    </Tooltip>
  ) : null;
}

/**
 * Retrieve account uncategorized transctions table columns.
 */
export function useAccountUncategorizedTransactionsColumns() {
  return React.useMemo(
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
        Header: intl.get('reference_no'),
        accessor: 'reference_number',
        width: 50,
        className: 'reference_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: statusAccessor,
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
