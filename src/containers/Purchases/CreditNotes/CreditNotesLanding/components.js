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

/**
 * Actions menu.
 */
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
        text={intl.get('vendor_credits.action.edit_vendor_credit')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="quick-payment-16" />}
        text={intl.get('vendor_credits.action.refund_vendor_credit')}
        onClick={safeCallback(onRefund, original)}
      />
      <MenuItem
        text={intl.get('vendor_credits.action.delete_vendor_credit')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Retrieve vendors credit note table columns.
 */
export function useVendorsCreditNoteTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'vendor_credit_date',
        Header: intl.get('date'),
        accessor: 'formatted_vendor_credit_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'vendor_credit_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 180,
        className: 'vendor_id',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'vendor_credit_number',
        Header: intl.get('vendor_credits.column.vendor_credit_no'),
        accessor: 'vendor_credit_number',
        width: 100,
        className: 'vendor_credit_number',
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
