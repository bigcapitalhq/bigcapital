// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

import { CLASSES } from '@/constants/classes';
import { FormattedMessage as T, Choose, If, Icon, Can } from '@/components';
import { safeCallback } from '@/utils';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Actions menu.
 */
export function ActionsMenu({
  payload: { onEdit, onDelete, onOpen, onRefund, onReconcile, onViewDetails },
  row: { original },
}) {
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
        <If condition={original.is_draft}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('vendor_credits.action.mark_as_open')}
            onClick={safeCallback(onOpen, original)}
          />
        </If>
      </Can>
      <Can I={VendorCreditAction.Refund} a={AbilitySubject.VendorCredit}>
        <If condition={!original.is_closed && original.is_published}>
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
            !original.is_draft && !original.is_closed && original.is_published
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

/**
 * Status accessor.
 */
export function StatusAccessor(creditNote) {
  return (
    <div>
      <Choose>
        <Choose.When condition={creditNote.is_open}>
          <Tag minimal={true} intent={Intent.WARNING} round={true}>
            <T id={'open'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_closed}>
          <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
            <T id={'closed'} />
          </Tag>
        </Choose.When>

        <Choose.When condition={creditNote.is_draft}>
          <Tag minimal={true} round={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.When>
      </Choose>
    </div>
  );
}

/**
 * Retrieve vendors credit note table columns.
 */
export function useVendorsCreditNoteTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'credit_date',
        Header: intl.get('date'),
        accessor: 'formatted_vendor_credit_date',
        width: 110,
        className: 'credit_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 180,
        className: 'vendor_id',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'credit_number',
        Header: intl.get('vendor_credits.column.vendor_credit_no'),
        accessor: 'vendor_credit_number',
        width: 100,
        className: 'credit_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'formatted_credits_remaining',
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
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
