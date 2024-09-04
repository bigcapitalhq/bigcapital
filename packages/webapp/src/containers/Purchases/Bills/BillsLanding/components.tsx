// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Intent,
  Menu,
  MenuItem,
  MenuDivider,
  Tag,
  ProgressBar,
} from '@blueprintjs/core';
import clsx from 'classnames';
import {
  FormatDateCell,
  FormattedMessage as T,
  Icon,
  If,
  Choose,
  Can,
} from '@/components';
import {
  formattedAmount,
  safeCallback,
  calculateStatus,
} from '@/utils';
import {
  BillAction,
  PaymentMadeAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { CLASSES } from '@/constants';

/**
 * Actions menu.
 */
export function ActionsMenu({
  payload: {
    onEdit,
    onOpen,
    onDelete,
    onQuick,
    onConvert,
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
      <Can I={BillAction.Edit} a={AbilitySubject.Bill}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_bill')}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuItem
          icon={<Icon icon="convert_to" />}
          text={intl.get('bill.convert_to_credit_note')}
          onClick={safeCallback(onConvert, original)}
        />

        <If condition={!original.is_open}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>
      <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
        <If condition={original.is_open && !original.is_fully_paid}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" iconSize={16} />}
            text={intl.get('add_payment')}
            onClick={safeCallback(onQuick, original)}
          />
        </If>
      </Can>
      <MenuItem
        icon={<Icon icon="receipt-24" iconSize={16} />}
        text={intl.get('allocate_landed_coast')}
        onClick={safeCallback(onAllocateLandedCost, original)}
      />
      <Can I={BillAction.Delete} a={AbilitySubject.Bill}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_bill')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
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
              value={calculateStatus(bill.balance, bill.amount)}
            />
          </If>
        </Choose.When>
        <Choose.Otherwise>
          <Tag minimal={true} round={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.Otherwise>
      </Choose>
    </div>
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
        accessor: 'formatted_bill_date',
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
        accessor: (row) => (row.bill_number ? `${row.bill_number}` : null),
        width: 100,
        className: 'bill_number',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'total_formatted',
        width: 120,
        align: 'right',
        clickable: true,
        money: true,
        className: clsx(CLASSES.FONT_BOLD),
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
        accessor: 'due_date',
        Cell: FormatDateCell,
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
