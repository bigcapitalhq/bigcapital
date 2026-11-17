import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import { CommercialDocFooter, If, DetailsMenu, DetailItem } from '@/components';

/**
 * Recurring invoice details footer.
 */
export function RecurringInvoiceDetailFooter() {
  const { recurringInvoice } = useRecurringInvoiceDetailDrawerContext();

  if (!recurringInvoice) {
    return null;
  }

  if (!recurringInvoice.termsConditions && !recurringInvoice.invoiceMessage) {
    return null;
  }

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={!!recurringInvoice.termsConditions}>
          <DetailItem label={intl.get('terms_conditions')} multiline>
            {recurringInvoice.termsConditions}
          </DetailItem>
        </If>

        <If condition={!!recurringInvoice.invoiceMessage}>
          <DetailItem
            label={intl.get('invoice.details.invoice_message')}
            multiline
          >
            {recurringInvoice.invoiceMessage}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
