import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { CreditNotesListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { If, Icon, Can } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

export type CreditNoteTableRow = NonNullable<
  CreditNotesListResponse['data']
>[number];

interface CreditNoteActionsPayload {
  onEdit: (creditNote: CreditNoteTableRow) => void;
  onDelete: (creditNote: CreditNoteTableRow) => void;
  onRefund: (creditNote: CreditNoteTableRow) => void;
  onOpen: (creditNote: CreditNoteTableRow) => void;
  onReconcile: (creditNote: CreditNoteTableRow) => void;
  onViewDetails: (creditNote: CreditNoteTableRow) => void;
  onSendMail: (creditNote: CreditNoteTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: CreditNoteTableRow };
  payload: CreditNoteActionsPayload;
}

export function ActionsMenu({
  payload: {
    onEdit,
    onDelete,
    onRefund,
    onOpen,
    onReconcile,
    onViewDetails,
    onSendMail,
  },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={CreditNoteAction.Edit} a={AbilitySubject.CreditNote}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('credit_note.action.edit_credit_note')}
          onClick={safeCallback(onEdit, original)}
        />
        <If condition={!!original.isDraft}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('credit_note.action.make_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>

      <Can I={CreditNoteAction.Refund} a={AbilitySubject.CreditNote}>
        <If condition={!!(!original.isClosed && original.isPublished)}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" />}
            text={intl.get('credit_note.action.refund_credit_note')}
            onClick={safeCallback(onRefund, original)}
          />
        </If>
      </Can>
      <Can I={CreditNoteAction.Edit} a={AbilitySubject.CreditNote}>
        <If condition={!!(!original.isClosed && original.isPublished)}>
          <MenuItem
            text={intl.get('credit_note.action.reconcile_with_invoices')}
            icon={<Icon icon="receipt-24" iconSize={16} />}
            onClick={safeCallback(onReconcile, original)}
          />
          <MenuItem
            icon={<Icon icon={'envelope'} iconSize={16} />}
            text={intl.get('credit_note.action.send_mail')}
            onClick={safeCallback(onSendMail, original)}
          />
        </If>
      </Can>
      <Can I={CreditNoteAction.Delete} a={AbilitySubject.CreditNote}>
        <MenuDivider />
        <MenuItem
          text={intl.get('credit_note.action.delete_credit_note')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

function getCreditNoteStatus(creditNote: CreditNoteTableRow) {
  if (creditNote.isOpen)
    return { text: intl.get('open'), intent: Intent.WARNING };
  if (creditNote.isClosed)
    return { text: intl.get('closed'), intent: Intent.SUCCESS };
  if (creditNote.isDraft)
    return { text: intl.get('draft'), intent: Intent.NONE };
}

export function StatusAccessor(creditNote: CreditNoteTableRow) {
  const status = getCreditNoteStatus(creditNote);
  return (
    <div>
      {status && (
        <Tag intent={status.intent} round minimal>
          {status.text}
        </Tag>
      )}
    </div>
  );
}

const column = createColumnHelper<BP_TableFeatures, CreditNoteTableRow>();

export function useCreditNoteTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedCreditNoteDate', {
          id: 'credit_date',
          header: intl.get('credit_note.column.credit_date'),
          size: 135,
        }),
        column.accessor((row) => row.customer?.displayName, {
          id: 'customer',
          header: intl.get('customer_name'),
          size: 250,
        }),
        column.accessor('creditNoteNumber', {
          id: 'credit_number',
          header: intl.get('credit_note.column.credit_note_no'),
          size: 150,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('formattedAmount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 160,
          meta: { textAlign: 'right', bodyCellClassName: 'numeric-cell' },
        }),
        column.accessor('formattedCreditsRemainingAmount', {
          id: 'balance',
          header: intl.get('balance'),
          size: 160,
          meta: { textAlign: 'right', bodyCellClassName: 'numeric-cell' },
          enableSorting: false,
        }),
        column.accessor((row) => getCreditNoteStatus(row)?.text, {
          id: 'status',
          header: intl.get('status'),
          size: 160,
          cell: ({ row }) => StatusAccessor(row.original),
        }),
        column.accessor('referenceNo', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 150,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
      ]),
    [],
  );
}
