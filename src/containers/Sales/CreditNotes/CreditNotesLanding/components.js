import React from 'react';
import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { CLASSES } from '../../../../common/classes';
import {
  FormatDateCell,
  FormattedMessage as T,
  Choose,
  If,
  Icon,
} from 'components';
import { safeCallback } from 'utils';

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
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('credit_note.action.edit_credit_note')}
        onClick={safeCallback(onEdit, original)}
      />
      <If condition={!original.is_closed && !original.is_draft}>
        <MenuItem
          icon={<Icon icon="quick-payment-16" />}
          text={intl.get('credit_note.action.refund_credit_note')}
          onClick={safeCallback(onRefund, original)}
        />
      </If>
      <If condition={original.is_draft}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('mark_as_opened')}
          onClick={safeCallback(onOpen, original)}
        />
      </If>
      <MenuItem
        text={'Reconcile Credit Note With Invoice'}
        // icon={<Icon icon="quick-payment-16" />}
        // text={intl.get('credit_note.action.refund_credit_note')}
        onClick={safeCallback(onReconcile, original)}
      />
      <MenuItem
        text={intl.get('credit_note.action.delete_credit_note')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
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
          <Tag minimal={true} intent={Intent.WARNING}>
            <T id={'open'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_closed}>
          <Tag minimal={true} intent={Intent.SUCCESS}>
            <T id={'closed'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_draft}>
          <Tag minimal={true}>
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
        id: 'credit_note_date',
        Header: intl.get('credit_note.column.credit_date'),
        accessor: 'formatted_credit_note_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'credit_note_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 180,
        className: 'customer_id',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'credit_note_number',
        Header: intl.get('credit_note.column.credit_note_no'),
        accessor: 'credit_note_number',
        width: 100,
        className: 'credit_note_number',
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
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
