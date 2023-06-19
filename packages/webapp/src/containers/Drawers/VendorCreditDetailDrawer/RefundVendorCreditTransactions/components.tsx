// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import { Can, FormatDateCell, Icon } from '@/components';
import { safeCallback } from '@/utils';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Actions menu.
 */
export function ActionsMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <Can I={VendorCreditAction.Delete} a={AbilitySubject.VendorCredit}>
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('delete_transaction')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

export function useRefundCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'formatted_date',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('refund_vendor_credit.column.amount'),
        accessor: 'formatted_amount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
      {
        Header: intl.get('refund_vendor_credit.column.withdrawal_account'),
        accessor: ({ deposit_account }) => deposit_account.name,
        width: 100,
        className: 'deposit_account',
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
