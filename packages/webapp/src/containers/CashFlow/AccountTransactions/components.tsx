// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import {
  Can,
  FormatDateCell,
  If,
  Icon,
  MaterialProgressBar,
} from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { TRANSACTIONS_TYPE } from '@/constants/cashflowOptions';
import { AbilitySubject, CashflowAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export function ActionsMenu({
  payload: { onDelete, onViewDetails },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={CashflowAction.Delete} a={AbilitySubject.Cashflow}>
        <If condition={TRANSACTIONS_TYPE.includes(original.reference_type)}>
          <MenuDivider />
          <MenuItem
            text={intl.get('delete_transaction')}
            intent={Intent.DANGER}
            onClick={safeCallback(onDelete, original)}
            icon={<Icon icon="trash-16" iconSize={16} />}
          />
        </If>
      </Can>
    </Menu>
  );
}
/**
 * Retrieve account transactions table columns.
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
  const { isCashFlowTransactionsFetching } = useAccountTransactionsContext();

  return isCashFlowTransactionsFetching ? <MaterialProgressBar /> : null;
}
