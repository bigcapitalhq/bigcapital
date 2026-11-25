import { Intent, Menu, MenuItem, MenuDivider, Tag } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { BillsListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { FormatDate, Icon, If, Can } from '@/components';
import { CLASSES, Features } from '@/constants';
import {
  BillAction,
  PaymentMadeAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { useFeatureCan } from '@/hooks/state';
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
  const { featureCan } = useFeatureCan();
  const isLandedCostEnabled = featureCan(Features.LandedCost);

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
      {isLandedCostEnabled && (
        <MenuItem
          icon={<Icon icon="receipt-24" iconSize={16} />}
          text={intl.get('allocate_landed_coast')}
          onClick={safeCallback(onAllocateLandedCost, original)}
        />
      )}
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

function getBillStatusTags(bill: BillTableRow) {
  if (!bill.isOpen) {
    return [{ text: intl.get('draft'), intent: Intent.NONE }];
  }
  if (bill.isFullyPaid) {
    return [{ text: intl.get('paid'), intent: Intent.SUCCESS }];
  }

  const due = bill.isOverdue
    ? {
        text: intl.get('overdue_by', { overdue: bill.overdueDays }),
        intent: Intent.DANGER,
      }
    : {
        text: intl.get('due_in', { due: bill.remainingDays }),
        intent: Intent.WARNING,
      };

  if (!bill.isPartiallyPaid) {
    return [due];
  }
  return [
    due,
    {
      text: intl.get('day_partially_paid', {
        due: formattedAmount(bill.dueAmount, bill.currencyCode),
      }),
      intent: Intent.PRIMARY,
    },
  ];
}

export function StatusAccessor(bill: BillTableRow) {
  return (
    <div className="status-accessor">
      {getBillStatusTags(bill).map(({ text, intent }) => (
        <Tag key={intent} round minimal intent={intent}>
          {text}
        </Tag>
      ))}
    </div>
  );
}

const column = createColumnHelper<BP_TableFeatures, BillTableRow>();

export function useBillsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedBillDate', {
          id: 'bill_date',
          header: intl.get('bill_date'),
          size: 150,
        }),
        column.accessor((row) => row.vendor?.displayName, {
          id: 'vendor',
          header: intl.get('vendor_name'),
          size: 200,
        }),
        column.accessor('billNumber', {
          id: 'bill_number',
          header: intl.get('bill_number'),
          size: 140,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('totalFormatted', {
          id: 'amount',
          header: intl.get('amount'),
          size: 150,
          meta: {
            textAlign: 'right',
            bodyCellClassName: clsx('numeric-cell', CLASSES.FONT_SEMIBOLD),
          },
        }),
        column.accessor(
          (bill) =>
            getBillStatusTags(bill)
              .map(({ text }) => text)
              .join(', '),
          {
            id: 'status',
            header: intl.get('status'),
            size: 200,
            cell: ({ row }) => StatusAccessor(row.original),
          },
        ),
        column.accessor('dueDate', {
          id: 'due_date',
          header: intl.get('due_date'),
          size: 140,
          cell: ({ getValue }) => <FormatDate value={getValue()} />,
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
