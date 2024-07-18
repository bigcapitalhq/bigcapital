// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Intent,
  Menu,
  MenuItem,
  Tag,
  PopoverInteractionKind,
  Position,
  Tooltip,
  Checkbox,
} from '@blueprintjs/core';
import { Box, FormatDateCell, Icon, MaterialProgressBar } from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { safeCallback } from '@/utils';
import {
  useAddTransactionsToCategorizeSelected,
  useRemoveTransactionsToCategorizeSelected,
} from '@/hooks/state/banking';

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
  const addTransactionsToCategorizeSelected =
    useAddTransactionsToCategorizeSelected();

  const removeTransactionsToCategorizeSelected =
    useRemoveTransactionsToCategorizeSelected();

  const handleChange = (value) => (event) => {
    if (event.currentTarget.checked) {
      addTransactionsToCategorizeSelected(value.id);
    } else {
      removeTransactionsToCategorizeSelected(value.id);
    }
  };

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
        Header: 'Ref.#',
        accessor: 'reference_no',
        width: 50,
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
      {
        id: 'categorize_include',
        Header: 'Include',
        accessor: (value) => <Checkbox large onChange={handleChange(value)} />,
        width: 10,
        minWidth: 10,
        maxWidth: 10,
        align: 'right',
      },
    ],
    [],
  );
}
