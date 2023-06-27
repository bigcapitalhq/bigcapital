// @ts-nocheck
import React from 'react';

import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice details footer.
 * @returns {React.JSX}
 */
export function InvoiceDetailFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  if (!invoice.terms_conditions && !invoice.invoice_message) {
    return null;
  }
  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
        <If condition={invoice.terms_conditions}>
          <DetailItem label={<T id={'terms_conditions'} />}>
            {invoice.terms_conditions}
          </DetailItem>
        </If>

        <If condition={invoice.invoice_message}>
          <DetailItem label={<T id={'invoice.details.invoice_message'} />}>
            {invoice.invoice_message}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
