// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import { Can, FormatDateCell, Icon } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Actions menu.
 */
export function ActionsMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <Can I={CreditNoteAction.Delete} a={AbilitySubject.CreditNote}>
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

/**
 * Credit note reconciliation with invoices table columns.
 */
export function useReconcileCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'formatted_credit_note_date',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('invoice_no'),
        accessor: 'invoice_number',
        width: 100,
        className: 'invoice_number',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
    ],
    [],
  );
}
