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
import type { PaymentsReceivedListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Money, Icon, Can } from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
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

const column = createColumnHelper<BP_TableFeatures, PaymentReceiveTableRow>();

export function usePaymentReceivesColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedPaymentDate', {
          id: 'payment_date',
          header: intl.get('payment_date'),
          size: 140,
        }),
        column.accessor((row) => row.customer?.displayName, {
          id: 'customer',
          header: intl.get('customer_name'),
          size: 160,
        }),
        column.accessor('amount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 120,
          cell: ({ getValue, row }) => (
            <MoneyDisplay>
              <Money amount={getValue()} currency={row.original.currencyCode} />
            </MoneyDisplay>
          ),
        }),
        column.accessor('paymentReceiveNo', {
          id: 'payment_receive_no',
          header: intl.get('payment_received_no'),
          size: 140,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor((row) => row.depositAccount?.name, {
          id: 'deposit_account',
          header: intl.get('deposit_account'),
          size: 140,
        }),
        column.accessor('referenceNo', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 140,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
      ]),
    [],
  );
}
