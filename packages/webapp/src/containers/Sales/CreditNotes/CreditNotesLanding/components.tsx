// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import {
  FormattedMessage as T,
  Choose,
  If,
  Icon,
  Can,
} from '@/components';
import { safeCallback } from '@/utils';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';

export function ActionsMenu({
  payload: { onEdit, onDelete, onRefund, onOpen, onReconcile, onViewDetails },
  row: { original },
}) {
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
        <If condition={original.is_draft}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('credit_note.action.make_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>

      <Can I={CreditNoteAction.Refund} a={AbilitySubject.CreditNote}>
        <If condition={!original.is_closed && original.is_published}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" />}
            text={intl.get('credit_note.action.refund_credit_note')}
            onClick={safeCallback(onRefund, original)}
          />
        </If>
      </Can>
      <Can I={CreditNoteAction.Edit} a={AbilitySubject.CreditNote}>
        <If condition={!original.is_closed && original.is_published}>
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

/**
 * Status accessor.
 */
export function StatusAccessor(creditNote) {
  return (
    <div>
      <Choose>
        <Choose.When condition={creditNote.is_open}>
          <Tag intent={Intent.WARNING} minimal={true} round={true}>
            <T id={'open'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_closed}>
          <Tag intent={Intent.SUCCESS} minimal={true} round={true}>
            <T id={'closed'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_draft}>
          <Tag intent={Intent.NONE} minimal={true} round={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.When>
      </Choose>
    </div>
  );
}

/**
 * Retrieve credit note table columns.
 */
export function useCreditNoteTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'credit_date',
        Header: intl.get('credit_note.column.credit_date'),
        accessor: 'formatted_credit_note_date',
        width: 110,
        className: 'credit_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 180,
        className: 'customer',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'credit_number',
        Header: intl.get('credit_note.column.credit_note_no'),
        accessor: 'credit_note_number',
        width: 100,
        className: 'credit_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'formatted_credits_remaining',
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
        width: 160, // 160
        className: 'status',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no', // or note
        width: 90,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
