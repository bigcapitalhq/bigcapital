import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { VendorCreditAppliedBill } from '@bigcapital/sdk-ts';
import { Can, FormatDateCell, Icon } from '@/components';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

interface ActionsMenuProps {
  payload: {
    onDelete: (row: { original: VendorCreditAppliedBill }) => void;
  };
  row: { original: VendorCreditAppliedBill };
}

/**
 * Actions menu.
 */
export function ActionsMenu({
  payload: { onDelete },
  row: { original },
}: ActionsMenuProps) {
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

export function useReconcileVendorCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'formattedBillDate',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('bill_number'),
        accessor: 'billReferenceNo',
        width: 100,
        className: 'bill_number',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formattedAmount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
    ],
    [],
  );
}
