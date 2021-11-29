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
  payload: {
    onEdit,
    onDeliver,
    onDelete,
    onDrawer,
    onQuick,
    onViewDetails,
    onPrint,
  },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('credit_note.label_edit_credit_note')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('credit_note.label_delete_credit_note')}
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
        id: 'date',
        Header: intl.get('date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
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
        id: 'credit_note',
        Header: intl.get('credit_note.label_credit_note_no'),
        accessor: 'credit_note',
        width: 100,
        className: 'credit_note',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        // accessor: 'formatted_amount',
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
