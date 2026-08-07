import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { CreditNotesListResponse } from '@bigcapital/sdk-ts';
import { FormattedMessage as T, Choose, If, Icon, Can } from '@/components';
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
}

interface ActionsMenuProps {
  row: { original: CreditNoteTableRow };
  payload: CreditNoteActionsPayload;
}

export function ActionsMenu({
  payload: { onEdit, onDelete, onRefund, onOpen, onReconcile, onViewDetails },
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

export function StatusAccessor(creditNote: CreditNoteTableRow) {
  return (
    <div>
      <Choose>
        <Choose.When condition={!!creditNote.isOpen}>
          <Tag intent={Intent.WARNING} round minimal>
            <T id={'open'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={!!creditNote.isClosed}>
          <Tag intent={Intent.SUCCESS} round minimal>
            <T id={'closed'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={!!creditNote.isDraft}>
          <Tag intent={Intent.NONE} round minimal>
            <T id={'draft'} />
          </Tag>
        </Choose.When>
      </Choose>
    </div>
  );
}

export function useCreditNoteTableColumns(): DataTableColumn<CreditNoteTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'credit_date',
          Header: intl.get('credit_note.column.credit_date'),
          accessor: 'formattedCreditNoteDate',
          width: 110,
          className: 'credit_date',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'customer',
          Header: intl.get('customer_name'),
          accessor: 'customer.displayName',
          width: 180,
          className: 'customer',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'credit_number',
          Header: intl.get('credit_note.column.credit_note_no'),
          accessor: 'creditNoteNumber',
          width: 100,
          className: 'credit_number',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: 'formattedAmount',
          width: 120,
          align: 'right',
          clickable: true,
          textOverview: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'balance',
          Header: intl.get('balance'),
          accessor: 'formattedCreditsRemaining',
          width: 120,
          align: 'right',
          clickable: true,
          textOverview: true,
          disableSortBy: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'status',
          Header: intl.get('status'),
          accessor: StatusAccessor,
          width: 160,
          className: 'status',
          clickable: true,
        },
        {
          id: 'reference_no',
          Header: intl.get('reference_no'),
          accessor: 'referenceNo',
          width: 90,
          className: 'reference_no',
          clickable: true,
          textOverview: true,
        },
      ] as DataTableColumn<CreditNoteTableRow>[],
    [],
  );
}
