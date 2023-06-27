// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';

import { Icon, Money, FormatDateCell, Can } from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';

import { safeCallback } from '@/utils';

export function AmountAccessor(row) {
  return <Money amount={row.amount} currency={row.currency_code} />;
}

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />

      <Can I={PaymentMadeAction.Edit} a={AbilitySubject.PaymentMade}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_payment_made')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={PaymentMadeAction.Delete} a={AbilitySubject.PaymentMade}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_payment_made')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

/**
 * Payments made table actions cell.
 */
export function ActionsCell(props) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Retrieve payments made table columns.
 */
export function usePaymentsMadeTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: intl.get('payment_date'),
        Cell: FormatDateCell,
        accessor: 'payment_date',
        width: 140,
        className: 'payment_date',
        clickable: true,
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor_id',
        clickable: true,
      },
      {
        id: 'payment_number',
        Header: intl.get('payment_number'),
        accessor: (row) =>
          row.payment_number ? `${row.payment_number}` : null,
        width: 140,
        className: 'payment_number',
        clickable: true,
      },
      {
        id: 'payment_account',
        Header: intl.get('payment_account'),
        accessor: 'payment_account.name',
        width: 140,
        className: 'payment_account_id',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
        align: 'right',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference'),
        accessor: 'reference',
        width: 140,
        className: 'reference',
        clickable: true,
      },
    ],
    [],
  );
}
