import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { PaymentsReceivedListResponse } from '@bigcapital/sdk-ts';
import { Money, Icon, Can } from '@/components';
import {
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

export type PaymentReceiveTableRow = NonNullable<
  PaymentsReceivedListResponse['data']
>[number];

interface PaymentReceiveActionsPayload {
  onEdit: (paymentReceive: PaymentReceiveTableRow) => void;
  onDelete: (paymentReceive: PaymentReceiveTableRow) => void;
  onViewDetails: (paymentReceive: PaymentReceiveTableRow) => void;
  onSendMail: (paymentReceive: PaymentReceiveTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: PaymentReceiveTableRow };
  payload: PaymentReceiveActionsPayload;
}

export function ActionsMenu({
  row: { original: paymentReceive },
  payload: { onEdit, onDelete, onViewDetails, onSendMail },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, paymentReceive)}
      />
      <MenuItem
        icon={<Icon icon={'envelope'} iconSize={16} />}
        text={'Send Mail'}
        onClick={safeCallback(onSendMail, paymentReceive)}
      />
      <Can I={PaymentReceiveAction.Edit} a={AbilitySubject.PaymentReceive}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_payment_received')}
          onClick={safeCallback(onEdit, paymentReceive)}
        />
      </Can>
      <Can I={PaymentReceiveAction.Delete} a={AbilitySubject.PaymentReceive}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_payment_received')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, paymentReceive)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

export function AmountAccessor(row: PaymentReceiveTableRow) {
  return <Money amount={row.amount} currency={row.currencyCode} />;
}

interface ActionsCellProps {
  row: { original: PaymentReceiveTableRow };
  payload: PaymentReceiveActionsPayload;
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

export function usePaymentReceivesColumns(): DataTableColumn<PaymentReceiveTableRow>[] {
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
          textOverview: true,
        },
        {
          id: 'customer',
          Header: intl.get('customer_name'),
          accessor: 'customer.displayName',
          width: 160,
          className: 'customer_id',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: AmountAccessor,
          width: 120,
          align: 'right',
          clickable: true,
          textOverview: true,
          money: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'payment_receive_no',
          Header: intl.get('payment_received_no'),
          accessor: (row: PaymentReceiveTableRow) =>
            row.paymentReceiveNo ? `${row.paymentReceiveNo}` : null,
          width: 140,
          className: 'payment_receive_no',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'deposit_account',
          Header: intl.get('deposit_account'),
          accessor: 'depositAccount.name',
          width: 140,
          className: 'deposit_account_id',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'reference_no',
          Header: intl.get('reference_no'),
          accessor: 'referenceNo',
          width: 140,
          className: 'reference_no',
          clickable: true,
          textOverview: true,
        },
      ] as DataTableColumn<PaymentReceiveTableRow>[],
    [],
  );
}
