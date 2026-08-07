import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { RefundCreditNoteTransaction } from '@bigcapital/sdk-ts';
import { Can, FormatDateCell, Icon } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

interface ActionsMenuPayload {
  onDelete: (row: RefundCreditNoteTransaction) => void;
}

interface ActionsMenuProps {
  payload: ActionsMenuPayload;
  row: { original: RefundCreditNoteTransaction };
}

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
        Header: intl.get('refund_credit_transactions.column.amount_refunded'),
        accessor: 'formattedAmount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
      {
        id: 'from_account',
        Header: intl.get(
          'refund_credit_transactions.column.withdrawal_account',
        ),
        accessor: (row: { fromAccount?: { name?: string } }) =>
          row.fromAccount?.name,
        width: 100,
        className: 'from_account',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'referenceNo',
        width: 100,
        className: 'reference_no',
        textOverview: true,
      },
    ],
    [],
  );
}
