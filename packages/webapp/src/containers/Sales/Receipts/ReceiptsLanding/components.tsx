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
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { SaleReceiptsListResponse } from '@bigcapital/sdk-ts';
import { FormattedMessage as T } from '@/components';
import { FormatDateCell, Choose, Money, Icon, If, Can } from '@/components';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
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
export function StatusAccessor(receipt: ReceiptTableRow) {
  return (
    <Choose>
      <Choose.When condition={receipt.isClosed}>
        <Tag intent={Intent.SUCCESS} round minimal>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag intent={Intent.WARNING} round minimal>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Retrieve receipts table columns.
 */
export function useReceiptsTableColumns(): DataTableColumn<ReceiptTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'receipt_date',
          Header: intl.get('receipt_date'),
          accessor: 'formattedReceiptDate',
          width: 140,
          className: 'receipt_date',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'customer',
          Header: intl.get('customer_name'),
          accessor: 'customer.displayName',
          width: 140,
          className: 'customer_id',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'receipt_number',
          Header: intl.get('receipt_number'),
          accessor: 'receiptNumber',
          width: 140,
          className: 'receipt_number',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'deposit_account',
          Header: intl.get('deposit_account'),
          accessor: 'depositAccount.name',
          width: 140,
          className: 'deposit_account',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: (r: ReceiptTableRow) => (
            <Money amount={r.total} currency={r.currencyCode} />
          ),
          width: 140,
          align: 'right',
          clickable: true,
          textOverview: true,
          money: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'status',
          Header: intl.get('status'),
          accessor: StatusAccessor,
          width: 140,
          className: 'status',
          clickable: true,
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
      ] as DataTableColumn<ReceiptTableRow>[],
    [],
  );
}
