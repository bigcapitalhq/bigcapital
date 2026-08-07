import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Can, FormatDateCell, Icon } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

interface ActionsMenuPayload {
  onDelete: (row: { id: number }) => void;
}

interface ActionsMenuProps {
  payload: ActionsMenuPayload;
  row: { original: { id: number } };
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
 * Credit note reconcilation with invoices table columns.
 */
export function useReconcileCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'formattedCreditNoteDate',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('invoice_no'),
        accessor: 'invoiceNumber',
        width: 100,
        className: 'invoice_number',
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
