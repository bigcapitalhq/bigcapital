import { Intent, Menu, MenuItem, MenuDivider, Tag } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BillsListResponse } from '@bigcapital/sdk-ts';
import {
  FormatDateCell,
  FormattedMessage as T,
  Icon,
  If,
  Choose,
  Can,
} from '@/components';
import { CLASSES } from '@/constants';
import {
  BillAction,
  PaymentMadeAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { formattedAmount, safeCallback } from '@/utils';

export type BillTableRow = NonNullable<BillsListResponse['data']>[number];

interface BillActionsPayload {
  onEdit: (bill: BillTableRow) => void;
  onOpen: (bill: BillTableRow) => void;
  onDelete: (bill: BillTableRow) => void;
  onQuick: (bill: BillTableRow) => void;
  onConvert: (bill: BillTableRow) => void;
  onViewDetails: (bill: BillTableRow) => void;
  onAllocateLandedCost: (bill: BillTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: BillTableRow };
  payload: BillActionsPayload;
}

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
}: ActionsMenuProps) {
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

        <If condition={!original.isOpen}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>
      <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
        <If condition={!!(original.isOpen && !original.isFullyPaid)}>
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

export function StatusAccessor(bill: BillTableRow) {
  return (
    <div className={'status-accessor'}>
      <Choose>
        <Choose.When condition={!!(bill.isFullyPaid && bill.isOpen)}>
          <Tag round minimal intent={Intent.SUCCESS}>
            <T id={'paid'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={!!bill.isOpen}>
          <Choose>
            <Choose.When condition={!!bill.isOverdue}>
              <Tag round minimal intent={Intent.DANGER}>
                {intl.get('overdue_by', { overdue: bill.overdueDays })}
              </Tag>
            </Choose.When>
            <Choose.Otherwise>
              <Tag round minimal intent={Intent.WARNING}>
                {intl.get('due_in', { due: bill.remainingDays })}
              </Tag>
            </Choose.Otherwise>
          </Choose>
          <If condition={!!bill.isPartiallyPaid}>
            <Tag round minimal intent={Intent.PRIMARY}>
              {intl.get('day_partially_paid', {
                due: formattedAmount(bill.dueAmount, bill.currencyCode),
              })}
            </Tag>
          </If>
        </Choose.When>

        <Choose.Otherwise>
          <Tag round minimal>
            <T id={'draft'} />
          </Tag>
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

export function useBillsTableColumns(): DataTableColumn<BillTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'bill_date',
          Header: intl.get('bill_date'),
          accessor: 'formattedBillDate',
          width: 110,
          className: 'bill_date',
          clickable: true,
        },
        {
          id: 'vendor',
          Header: intl.get('vendor_name'),
          accessor: 'vendor.displayName',
          width: 180,
          className: 'vendor',
          clickable: true,
        },
        {
          id: 'bill_number',
          Header: intl.get('bill_number'),
          accessor: (row: BillTableRow) =>
            row.billNumber ? `${row.billNumber}` : null,
          width: 100,
          className: 'bill_number',
          clickable: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: 'totalFormatted',
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
          accessor: 'dueDate',
          Cell: FormatDateCell,
          width: 110,
          className: 'due_date',
          clickable: true,
        },
        {
          id: 'reference_no',
          Header: intl.get('reference_no'),
          accessor: 'referenceNo',
          width: 90,
          className: 'reference_no',
          clickable: true,
        },
      ] as DataTableColumn<BillTableRow>[],
    [],
  );
}
