// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { FormattedMessage as T } from '@/components';
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

import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';
import { FormatDateCell, Choose, Money, Icon, If, Can } from '@/components';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Receipts table row actions menu.
 * @returns {React.JSX}
 */
export function ActionsMenu({
  payload: { onEdit, onDelete, onClose, onSendMail, onViewDetails, onPrint },
  row: { original: receipt },
}) {
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

        <If condition={!receipt.is_closed}>
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
 * Status accessor.
 */
export function StatusAccessor(receipt) {
  return (
    <Choose>
      <Choose.When condition={receipt.is_closed}>
        <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true} intent={Intent.WARNING} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Retrieve receipts table columns.
 */
export function useReceiptsTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: intl.get('receipt_date'),
        accessor: 'formatted_receipt_date',
        width: 140,
        className: 'receipt_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'receipt_number',
        Header: intl.get('receipt_number'),
        accessor: 'receipt_number',
        width: 140,
        className: 'receipt_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'deposit_account',
        Header: intl.get('deposit_account'),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: (r) => <Money amount={r.amount} currency={r.currency_code} />,
        width: 140,
        align: 'right',
        clickable: true,
        textOverview: true,
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
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
