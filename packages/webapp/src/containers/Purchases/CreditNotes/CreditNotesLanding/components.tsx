import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { VendorCreditsListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { If, Icon, Can } from '@/components';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

// Backend Vendor Credits list response DTO is not yet declared in the OpenAPI
// schema, so the SDK envelope resolves to `unknown`. This intersection keeps
// the SDK reference while supplying the row fields locally; switch to
// `NonNullable<VendorCreditsListResponse['data']>[number]` once the backend
// declares the response DTO.
export type VendorCreditTableRow = VendorCreditsListResponse & {
  id: number;
  vendorCreditNumber?: string;
  formattedVendorCreditDate?: string;
  formattedAmount?: string;
  formattedCreditsRemaining?: string;
  formattedCreditsRemainingAmount?: string;
  referenceNo?: string;
  vendor?: { displayName?: string };
  isDraft?: boolean;
  isOpen?: boolean;
  isClosed?: boolean;
  isPublished?: boolean;
};

interface VendorCreditActionsPayload {
  onEdit: (credit: VendorCreditTableRow) => void;
  onDelete: (credit: VendorCreditTableRow) => void;
  onOpen: (credit: VendorCreditTableRow) => void;
  onRefund: (credit: VendorCreditTableRow) => void;
  onReconcile: (credit: VendorCreditTableRow) => void;
  onViewDetails: (credit: VendorCreditTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: VendorCreditTableRow };
  payload: VendorCreditActionsPayload;
}

export function ActionsMenu({
  payload: { onEdit, onDelete, onOpen, onRefund, onReconcile, onViewDetails },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={VendorCreditAction.Edit} a={AbilitySubject.VendorCredit}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('vendor_credits.action.edit_vendor_credit')}
          onClick={safeCallback(onEdit, original)}
        />
        <If condition={!!original.isDraft}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('vendor_credits.action.mark_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>
      <Can I={VendorCreditAction.Refund} a={AbilitySubject.VendorCredit}>
        <If condition={!!(!original.isClosed && original.isPublished)}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" />}
            text={intl.get('vendor_credits.action.refund_vendor_credit')}
            onClick={safeCallback(onRefund, original)}
          />
        </If>
      </Can>
      <Can I={VendorCreditAction.Edit} a={AbilitySubject.VendorCredit}>
        <If
          condition={
            !!(!original.isDraft && !original.isClosed && original.isPublished)
          }
        >
          <MenuItem
            text={intl.get('vendor_credits.action.reconcile_with_bills')}
            icon={<Icon icon="receipt-24" iconSize={16} />}
            onClick={safeCallback(onReconcile, original)}
          />
        </If>
      </Can>
      <Can I={VendorCreditAction.Delete} a={AbilitySubject.VendorCredit}>
        <MenuDivider />
        <MenuItem
          text={intl.get('vendor_credits.action.delete_vendor_credit')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

function getVendorCreditStatus(creditNote: VendorCreditTableRow) {
  if (creditNote.isOpen) {
    return { text: intl.get('open'), intent: Intent.WARNING };
  }
  if (creditNote.isClosed) {
    return { text: intl.get('closed'), intent: Intent.SUCCESS };
  }
  if (creditNote.isDraft) {
    return { text: intl.get('draft'), intent: Intent.NONE };
  }
}

export function StatusAccessor(creditNote: VendorCreditTableRow) {
  const status = getVendorCreditStatus(creditNote);
  return (
    <div>
      {status && (
        <Tag intent={status.intent} round minimal>
          {status.text}
        </Tag>
      )}
    </div>
  );
}

const column = createColumnHelper<BP_TableFeatures, VendorCreditTableRow>();

export function useVendorsCreditNoteTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedVendorCreditDate', {
          id: 'credit_date',
          header: intl.get('date'),
          size: 110,
        }),
        column.accessor((row) => row.vendor?.displayName, {
          id: 'vendor',
          header: intl.get('vendor_name'),
          size: 180,
        }),
        column.accessor('vendorCreditNumber', {
          id: 'credit_number',
          header: intl.get('vendor_credits.column.vendor_credit_no'),
          size: 100,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('formattedAmount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 120,
          meta: {
            textAlign: 'right',
            bodyCellClassName: clsx('numeric-cell', CLASSES.FONT_SEMIBOLD),
          },
        }),
        column.accessor('formattedCreditsRemainingAmount', {
          id: 'balance',
          header: intl.get('balance'),
          size: 120,
          enableSorting: false,
          meta: {
            textAlign: 'right',
            bodyCellClassName: clsx('numeric-cell', CLASSES.FONT_SEMIBOLD),
          },
        }),
        column.accessor((row) => getVendorCreditStatus(row)?.text, {
          id: 'status',
          header: intl.get('status'),
          size: 160,
          cell: ({ row }) => StatusAccessor(row.original),
        }),
        column.accessor('referenceNo', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 90,
          meta: { bodyCellInnerClassName: CLASSES.TEXT_MUTED },
        }),
      ]),
    [],
  );
}
