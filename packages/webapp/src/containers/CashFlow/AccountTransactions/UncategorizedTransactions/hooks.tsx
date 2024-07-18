// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Checkbox,
  Intent,
  PopoverInteractionKind,
  Position,
  Tag,
  Tooltip,
} from '@blueprintjs/core';
import {
  useAddTransactionsToCategorizeSelected,
  useRemoveTransactionsToCategorizeSelected,
} from '@/hooks/state/banking';
import { Box, Icon } from '@/components';
import styles from './AccountTransactionsUncategorizedTable.module.scss';

function statusAccessor(transaction) {
  return transaction.is_recognized ? (
    <Tooltip
      // compact
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
        Header: '',
        accessor: (value) => (
          <Checkbox
            large
            onChange={handleChange(value)}
            className={styles.categorizeCheckbox}
          />
        ),
        width: 10,
        minWidth: 10,
        maxWidth: 10,
        align: 'right',
        className: 'categorize_include',
      },
    ],
    [],
  );
}
