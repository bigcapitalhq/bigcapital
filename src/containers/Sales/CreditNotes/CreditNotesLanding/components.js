import React from 'react';
import {
  Intent,
  Tag,
  Menu,
  MenuItem,
  MenuDivider,
  ProgressBar,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { CLASSES } from '../../../../common/classes';
import {
  FormatDateCell,
  FormattedMessage as T,
  AppToaster,
  Choose,
  If,
  Icon,
} from 'components';
import { formattedAmount, safeCallback, calculateStatus } from 'utils';

export function ActionsMenu({
  payload: { onEdit, onDelete, onRefund, onViewDetails },
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
      <MenuItem
        icon={<Icon icon="quick-payment-16" />}
        text={intl.get('credit_note.action.refund_credit_note')}
        onClick={safeCallback(onRefund, original)}
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
        // accessor:
        width: 120, // 160
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
