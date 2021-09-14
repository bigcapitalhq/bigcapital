import React from 'react';
import {
  Intent,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Button,
  Position,
  Tag,
  ProgressBar,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import moment from 'moment';

import { FormattedMessage as T, Icon, If, Choose, Money } from 'components';
import { formattedAmount, safeCallback, isBlank, calculateStatus } from 'utils';

/**
 * Actions menu.
 */
export function ActionsMenu({
  payload: {
    onEdit,
    onOpen,
    onDelete,
    onQuick,
    onViewDetails,
    onAllocateLandedCost,
  },
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
        text={intl.get('edit_bill')}
        onClick={safeCallback(onEdit, original)}
      />

      <If condition={!original.is_open}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('mark_as_opened')}
          onClick={safeCallback(onOpen, original)}
        />
      </If>
      <If condition={original.is_open && !original.is_fully_paid}>
        <MenuItem
          icon={<Icon icon="quick-payment-16" iconSize={16} />}
          text={intl.get('add_payment')}
          onClick={safeCallback(onQuick, original)}
        />
      </If>
      <MenuItem
        icon={<Icon icon="receipt-24" iconSize={16} />}
        text={intl.get('allocate_landed_coast')}
        onClick={safeCallback(onAllocateLandedCost, original)}
      />
      <MenuItem
        text={intl.get('delete_bill')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Amount accessor.
 */
export function AmountAccessor(bill) {
  return !isBlank(bill.amount) ? (
    <Money amount={bill.amount} currency={bill.currency_code} />
  ) : (
    ''
  );
}

/**
 * Status accessor.
 */
export function StatusAccessor(bill) {
  return (
    <div className={'status-accessor'}>
      <Choose>
        <Choose.When condition={bill.is_fully_paid && bill.is_open}>
          <span className={'fully-paid-icon'}>
            <Icon icon="small-tick" iconSize={18} />
          </span>
          <span class="fully-paid-text">
            <T id={'paid'} />
          </span>
        </Choose.When>
        <Choose.When condition={bill.is_open}>
          <Choose>
            <Choose.When condition={bill.is_overdue}>
              <span className={'overdue-status'}>
                {intl.get('overdue_by', { overdue: bill.overdue_days })}
              </span>
            </Choose.When>
            <Choose.Otherwise>
              <span className={'due-status'}>
                {intl.get('due_in', { due: bill.remaining_days })}
              </span>
            </Choose.Otherwise>
          </Choose>
          <If condition={bill.is_partially_paid}>
            <span className="partial-paid">
              {intl.get('day_partially_paid', {
                due: formattedAmount(bill.due_amount, bill.currency_code),
              })}
            </span>
            <ProgressBar
              animate={false}
              stripes={false}
              intent={Intent.PRIMARY}
              value={calculateStatus(bill.payment_amount, bill.amount)}
            />
          </If>
        </Choose.When>
        <Choose.Otherwise>
          <Tag minimal={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

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
 * Retrieve bills table columns.
 */
export function useBillsTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: intl.get('bill_date'),
        accessor: (r) => moment(r.bill_date).format('YYYY MMM DD'),
        width: 110,
        className: 'bill_date',
        clickable: true,
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 180,
        className: 'vendor',
        clickable: true,
      },
      {
        id: 'bill_number',
        Header: intl.get('bill_number'),
        accessor: (row) => (row.bill_number ? `#${row.bill_number}` : null),
        width: 100,
        className: 'bill_number',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 120,
        className: 'amount',
        align: 'right',
        clickable: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: StatusAccessor,
        width: 160,
        className: 'status',
        clickable: true,
      },
      {
        id: 'due_date',
        Header: intl.get('due_date'),
        accessor: (r) => moment(r.due_date).format('YYYY MMM DD'),
        width: 110,
        className: 'due_date',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
        clickable: true,
      },
    ],
    [],
  );
}
