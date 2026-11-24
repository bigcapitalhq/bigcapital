import { Button, Classes, Intent, Tag } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import { BalanceCell, NormalCell } from './components';
import type { AccountTableRow } from './components';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { AppToaster } from '@/components';
import { transformTableStateToQuery, isBlank } from '@/utils';

export const DeleteAccountTypeError = {
  AccountPredefined: 'account_predefined',
  AccountHasAssociatedTransactions: 'account_has_associated_transactions',
};

interface DeleteError {
  type: string;
}

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

const column = createColumnHelper<BP_TableFeatures, AccountTableRow>();

export const stopExpanderPropagation = (event: React.MouseEvent) =>
  event.stopPropagation();

export function useAccountsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('name', {
          header: ({ table }) => {
            const expanded = table.getIsAllRowsExpanded();
            const onToggleAllRowsExpanded =
              table.getToggleAllRowsExpandedHandler();
            return (
              <>
                <Button
                  className="accounts-expand-all"
                  minimal
                  size="small"
                  icon={expanded ? 'caret-down' : 'caret-right'}
                  aria-label={intl.get(
                    expanded ? 'accounts.collapse_all' : 'accounts.expand_all',
                  )}
                  aria-expanded={expanded}
                  disabled={!table.getCanSomeRowsExpand()}
                  onMouseDown={stopExpanderPropagation}
                  onClick={onToggleAllRowsExpanded}
                />
                {intl.get('account_name')}
              </>
            );
          },
          size: 200,
        }),
        column.accessor('code', {
          header: intl.get('code'),
          size: 80,
          cell: ({ getValue }) => {
            const code = getValue();
            return isBlank(code) ? null : (
              <Tag minimal round>
                {code}
              </Tag>
            );
          },
        }),
        column.accessor('accountTypeLabel', {
          id: 'type',
          header: intl.get('type'),
          size: 140,
        }),
        column.accessor('accountNormal', {
          id: 'normal',
          header: intl.get('account_normal'),
          size: 80,
          cell: ({ getValue }) => <NormalCell value={getValue()} />,
        }),
        column.accessor('currencyCode', {
          id: 'currency',
          header: intl.get('currency'),
          size: 75,
          cell: ({ getValue }) => (
            <span className={Classes.TEXT_MUTED}>{getValue()}</span>
          ),
        }),
        column.accessor('bankBalanceFormatted', {
          id: 'bank_balance',
          header: 'Bank Balance',
          size: 150,
          meta: { textAlign: 'right' },
          cell: ({ row, getValue }) => (
            <BalanceCell
              value={row.original.amount === null ? null : getValue()}
            />
          ),
        }),
        column.accessor('amount', {
          id: 'balance',
          header: intl.get('balance'),
          size: 150,
          meta: { textAlign: 'right' },
          cell: ({ row, getValue }) => (
            <BalanceCell
              value={getValue() === null ? null : row.original.formattedAmount}
            />
          ),
        }),
      ]),
    [],
  );
}

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
