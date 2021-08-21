import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';

import { T, Choose, Icon } from 'components';

import { highlightText } from 'utils';

import { RESOURCES_TYPES } from 'common/resourcesTypes';
import withDrawerActions from '../../Drawer/withDrawerActions';

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
    openDrawer('invoice-drawer', { invoiceId: resourceId });
  }
  return null;
}

export const InvoiceUniversalSearchSelect = withDrawerActions(
  InvoiceUniversalSearchSelectComponent,
);

/**
 * Invoice status.
 */
function InvoiceStatus(customer) {
  return (
    <Choose>
      <Choose.When condition={customer.is_fully_paid && customer.is_delivered}>
        <span class="status status-success">
          <T id={'paid'} />
        </span>
      </Choose.When>

      <Choose.When condition={customer.is_delivered}>
        <Choose>
          <Choose.When condition={customer.is_overdue}>
            <span className={'status status-warning'}>
              {intl.get('overdue_by', { overdue: customer.overdue_days })}
            </span>
          </Choose.When>
          <Choose.Otherwise>
            <span className={'status status-warning'}>
              {intl.get('due_in', { due: customer.remaining_days })}
            </span>
          </Choose.Otherwise>
        </Choose>
      </Choose.When>
      <Choose.Otherwise>
        <span class="status status--gray">
          <T id={'draft'} />
        </span>
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
          <span class="bp3-text-muted">
            {highlightText(item.reference.invoice_no, query)}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {highlightText(item.reference.formatted_invoice_date, query)}
          </span>
        </div>
      }
      label={
        <>
          <div class="amount">${item.reference.balance}</div>
          <InvoiceStatus customer={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--invoice'}
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
  optionItemLabel: 'Invoices',
  selectItemAction: InvoiceUniversalSearchSelect,
  itemRenderer: InvoiceUniversalSearchItem,
  itemSelect: transformInvoicesToSearch,
});
