import { MenuItem, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { SaleInvoice } from '@bigcapital/sdk-ts';
import { T, Choose, Icon, TextStatus } from '@/components';
import { AbilitySubject, SaleInvoiceAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { highlightText } from '@/utils';

interface InvoiceUniversalSearchSelectProps extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
}

/**
 * Universal search invoice item select action.
 */
function InvoiceUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}: InvoiceUniversalSearchSelectProps) {
  if (resourceType === RESOURCES_TYPES.INVOICE) {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId: resourceId });
  }
  return null;
}

export const InvoiceUniversalSearchSelect = withDrawerActions(
  InvoiceUniversalSearchSelectComponent,
);

/**
 * Invoice status.
 */
function InvoiceStatus({ customer }: { customer: SaleInvoice }) {
  return (
    <Choose>
      <Choose.When condition={customer.isFullyPaid && customer.isDelivered}>
        <TextStatus intent={Intent.SUCCESS}>
          <T id={'paid'} />
        </TextStatus>
      </Choose.When>

      <Choose.When condition={customer.isDelivered}>
        <Choose>
          <Choose.When condition={customer.isOverdue}>
            <TextStatus intent={Intent.DANGER}>
              {intl.get('overdue_by', { overdue: customer.overdueDays })}
            </TextStatus>
          </Choose.When>
          <Choose.Otherwise>
            <TextStatus intent={Intent.WARNING}>
              {intl.get('due_in', { due: customer.remainingDays })}
            </TextStatus>
          </Choose.Otherwise>
        </Choose>
      </Choose.When>
      <Choose.Otherwise>
        <TextStatus intent={Intent.NONE}>
          <T id={'draft'} />
        </TextStatus>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Universal search invoice item.
 */
interface InvoiceUniversalSearchItemData {
  id: number;
  text: string;
  label: string;
  reference: SaleInvoice;
}

interface InvoiceUniversalSearchItemActions {
  handleClick: () => void;
  modifiers: { active: boolean };
  query: string;
}

export function InvoiceUniversalSearchItem(
  item: InvoiceUniversalSearchItemData,
  { handleClick, modifiers, query }: InvoiceUniversalSearchItemActions,
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>
          <span className="bp4-text-muted">
            {highlightText(item.reference.invoiceNo, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.invoiceDateFormatted}
          </span>
        </div>
      }
      labelElement={
        <>
          <div className="amount">{item.reference.totalFormatted}</div>
          <InvoiceStatus customer={item.reference} />
        </>
      }
      onClick={handleClick}
    />
  );
}

/**
 * Transformes invoices to search.
 * @param {*} invoice
 * @returns
 */
const transformInvoicesToSearch = (invoice: SaleInvoice) => ({
  id: invoice.id,
  text: invoice.customer?.displayName ?? '',
  label: invoice.totalFormatted ?? '',
  reference: invoice,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchInvoiceBind = () => ({
  resourceType: RESOURCES_TYPES.INVOICE,
  optionItemLabel: intl.get('invoices'),
  selectItemAction: InvoiceUniversalSearchSelect,
  itemRenderer: InvoiceUniversalSearchItem,
  itemSelect: transformInvoicesToSearch,
  permission: {
    ability: SaleInvoiceAction.View,
    subject: AbilitySubject.Invoice,
  },
});
