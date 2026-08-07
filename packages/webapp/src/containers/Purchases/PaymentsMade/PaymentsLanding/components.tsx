import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BillPaymentsListResponse } from '@bigcapital/sdk-ts';
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

export function usePaymentMadesTableColumns(): DataTableColumn<PaymentMadeTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'payment_date',
          Header: intl.get('payment_date'),
          accessor: 'formattedPaymentDate',
          width: 140,
          className: 'payment_date',
          clickable: true,
        },
        {
          id: 'vendor',
          Header: intl.get('vendor_name'),
          accessor: 'vendor.displayName',
          width: 140,
          className: 'vendor_id',
          clickable: true,
        },
        {
          id: 'payment_number',
          Header: intl.get('payment_number'),
          accessor: (row: PaymentMadeTableRow) =>
            row.paymentNumber ? `${row.paymentNumber}` : null,
          width: 140,
          className: 'payment_number',
          clickable: true,
        },
        {
          id: 'payment_account',
          Header: intl.get('payment_account'),
          accessor: 'paymentAccount.name',
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
          money: true,
        },
        {
          id: 'reference_no',
          Header: intl.get('reference'),
          accessor: 'reference',
          width: 140,
          className: 'reference',
          clickable: true,
        },
      ] as DataTableColumn<PaymentMadeTableRow>[],
    [],
  );
}
