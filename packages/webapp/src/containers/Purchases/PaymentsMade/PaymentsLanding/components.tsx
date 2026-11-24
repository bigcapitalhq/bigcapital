import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { BillPaymentsListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Icon, Money, Can } from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type PaymentMadeTableRow = NonNullable<
  BillPaymentsListResponse['data']
>[number];

export function AmountAccessor(row: PaymentMadeTableRow) {
  return <Money amount={row.amount} currency={row.currencyCode} />;
}

interface PaymentMadeActionsPayload {
  onEdit: (paymentMade: PaymentMadeTableRow) => void;
  onDelete: (paymentMade: PaymentMadeTableRow) => void;
  onViewDetails: (paymentMade: PaymentMadeTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: PaymentMadeTableRow };
  payload: PaymentMadeActionsPayload;
}

export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails },
}: ActionsMenuProps) {
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

interface ActionsCellProps {
  row: { original: PaymentMadeTableRow };
  payload: PaymentMadeActionsPayload;
  [key: string]: any;
}

export function ActionsCell(props: ActionsCellProps) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

const column = createColumnHelper<BP_TableFeatures, PaymentMadeTableRow>();

export function usePaymentMadesTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedPaymentDate', {
          id: 'payment_date',
          header: intl.get('payment_date'),
          size: 140,
        }),
        column.accessor((row) => row.vendor?.displayName, {
          id: 'vendor',
          header: intl.get('vendor_name'),
          size: 140,
        }),
        column.accessor('paymentNumber', {
          id: 'payment_number',
          header: intl.get('payment_number'),
          size: 140,
        }),
        column.accessor((row) => row.paymentAccount?.name, {
          id: 'payment_account',
          header: intl.get('payment_account'),
          size: 140,
        }),
        column.accessor('amount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 140,
          cell: ({ row }) => AmountAccessor(row.original),
          meta: { bodyCellClassName: 'numeric-cell' },
        }),
        column.accessor('reference', {
          id: 'reference_no',
          header: intl.get('reference'),
          size: 140,
        }),
      ]),
    [],
  );
}
