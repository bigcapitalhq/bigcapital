import {
  Position,
  Menu,
  MenuItem,
  MenuDivider,
  Intent,
  Popover,
  Tag,
  Button,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { SaleReceiptsListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Money, Icon, If, Can } from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import { CLASSES } from '@/constants';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type ReceiptTableRow = NonNullable<
  SaleReceiptsListResponse['data']
>[number];

interface ReceiptActionsPayload {
  onEdit: (receipt: ReceiptTableRow) => void;
  onDelete: (receipt: ReceiptTableRow) => void;
  onClose: (receipt: ReceiptTableRow) => void;
  onSendMail: (receipt: ReceiptTableRow) => void;
  onViewDetails: (receipt: ReceiptTableRow) => void;
  onPrint: (receipt: ReceiptTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: ReceiptTableRow };
  payload: ReceiptActionsPayload;
}

/**
 * Receipts table row actions menu.
 * @returns {React.JSX}
 */
export function ActionsMenu({
  payload: { onEdit, onDelete, onClose, onSendMail, onViewDetails, onPrint },
  row: { original: receipt },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, receipt)}
      />
      <Can I={SaleReceiptAction.Edit} a={AbilitySubject.Receipt}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_receipt')}
          onClick={safeCallback(onEdit, receipt)}
        />

        <If condition={!receipt.isClosed}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_closed')}
            onClick={safeCallback(onClose, receipt)}
          />
        </If>
      </Can>
      <Can I={SaleReceiptAction.View} a={AbilitySubject.Receipt}>
        <MenuItem
          icon={<Icon icon={'envelope'} iconSize={16} />}
          text={'Send Mail'}
          onClick={safeCallback(onSendMail, receipt)}
        />
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, receipt)}
        />
      </Can>
      <Can I={SaleReceiptAction.Delete} a={AbilitySubject.Receipt}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_receipt')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, receipt)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

/**
 * Actions cell.
 */
export function ActionsCell(props: ActionsMenuProps) {
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
 * Status accessor.
 */
function getReceiptStatus(receipt: ReceiptTableRow) {
  return receipt.isClosed ? intl.get('closed') : intl.get('draft');
}

export function StatusAccessor(receipt: ReceiptTableRow) {
  return (
    <Tag
      intent={receipt.isClosed ? Intent.SUCCESS : Intent.WARNING}
      round
      minimal
    >
      {getReceiptStatus(receipt)}
    </Tag>
  );
}

const column = createColumnHelper<BP_TableFeatures, ReceiptTableRow>();

export function useReceiptsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedReceiptDate', {
          id: 'receipt_date',
          header: intl.get('receipt_date'),
          size: 140,
        }),
        column.accessor((row) => row.customer?.displayName, {
          id: 'customer',
          header: intl.get('customer_name'),
          size: 140,
        }),
        column.accessor('receiptNumber', {
          id: 'receipt_number',
          header: intl.get('receipt_number'),
          size: 140,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor((row) => row.depositAccount?.name, {
          id: 'deposit_account',
          header: intl.get('deposit_account'),
          size: 140,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('total', {
          id: 'amount',
          header: intl.get('amount'),
          size: 140,
          meta: { textAlign: 'right' },
          cell: ({ getValue, row }) => (
            <MoneyDisplay>
              <Money amount={getValue()} currency={row.original.currencyCode} />
            </MoneyDisplay>
          ),
        }),
        column.accessor(getReceiptStatus, {
          id: 'status',
          header: intl.get('status'),
          size: 140,
          cell: ({ row }) => StatusAccessor(row.original),
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
