import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { VendorCreditsListResponse } from '@bigcapital/sdk-ts';
import { FormattedMessage as T, Choose, If, Icon, Can } from '@/components';
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

export function StatusAccessor(creditNote: VendorCreditTableRow) {
  return (
    <div>
      <Choose>
        <Choose.When condition={!!creditNote.isOpen}>
          <Tag intent={Intent.WARNING} round minimal>
            <T id={'open'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={!!creditNote.isClosed}>
          <Tag intent={Intent.SUCCESS} round minimal>
            <T id={'closed'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={!!creditNote.isDraft}>
          <Tag round minimal>
            <T id={'draft'} />
          </Tag>
        </Choose.When>
      </Choose>
    </div>
  );
}

export function useVendorsCreditNoteTableColumns(): DataTableColumn<VendorCreditTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'credit_date',
          Header: intl.get('date'),
          accessor: 'formattedVendorCreditDate',
          width: 110,
          className: 'credit_date',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'vendor',
          Header: intl.get('vendor_name'),
          accessor: 'vendor.displayName',
          width: 180,
          className: 'vendor_id',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'credit_number',
          Header: intl.get('vendor_credits.column.vendor_credit_no'),
          accessor: 'vendorCreditNumber',
          width: 100,
          className: 'credit_number',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: 'formattedAmount',
          width: 120,
          align: 'right',
          clickable: true,
          textOverview: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'balance',
          Header: intl.get('balance'),
          accessor: 'formattedCreditsRemaining',
          width: 120,
          align: 'right',
          clickable: true,
          textOverview: true,
          disableSortBy: true,
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
          id: 'reference_no',
          Header: intl.get('reference_no'),
          accessor: 'referenceNo',
          width: 90,
          className: 'reference_no',
          clickable: true,
          textOverview: true,
        },
      ] as DataTableColumn<VendorCreditTableRow>[],
    [],
  );
}
