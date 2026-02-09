// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Intent } from '@blueprintjs/core';

import { T, Choose, Icon, TextStatus } from '@/components';
import { highlightText } from '@/utils';

import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { AbilitySubject, SaleInvoiceAction } from '@/constants/abilityOption';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Universal search invoice item select action.
 */
function InvoiceUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
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
function InvoiceStatus({ customer }) {
  return (
    <Choose>
      <Choose.When condition={customer.is_fully_paid && customer.is_delivered}>
        <TextStatus intent={Intent.SUCCESS}>
          <T id={'paid'} />
        </TextStatus>
      </Choose.When>

      <Choose.When condition={customer.is_delivered}>
        <Choose>
          <Choose.When condition={customer.is_overdue}>
            <TextStatus intent={Intent.DANGER}>
              {intl.get('overdue_by', { overdue: customer.overdue_days })}
            </TextStatus>
          </Choose.When>
          <Choose.Otherwise>
            <TextStatus intent={Intent.WARNING}>
              {intl.get('due_in', { due: customer.remaining_days })}
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
export function InvoiceUniversalSearchItem(
  item,
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>
          <span class="bp4-text-muted">
            {highlightText(item.reference.invoice_no, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.invoice_date_formatted}
          </span>
        </div>
      }
      label={
        <>
          <div class="amount">{item.reference.total_formatted}</div>
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
const transformInvoicesToSearch = (invoice) => ({
  id: invoice.id,
  text: invoice.customer.display_name,
  label: invoice.formatted_balance,
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
