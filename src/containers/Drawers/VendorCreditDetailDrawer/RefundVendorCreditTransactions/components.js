import React from 'react';
import intl from 'react-intl-universal';
import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import { FormatDateCell, Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Actions menu.
 */
export function ActionsMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_transaction')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

export function useRefundCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('refund_vendor_credit.column.amount'),
        accessor: 'amount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
      {
        Header: intl.get('refund_vendor_credit.column.withdrawal_account'),
        accessor: ({ from_account }) => from_account.name,
        width: 100,
        className: 'from_account',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 100,
        className: 'reference_no',
        textOverview: true,
      },
    ],
    [],
  );
}
