import React from 'react';
import intl from 'react-intl-universal';

import { Card, DetailsMenu, DetailItem } from 'components';

import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice detail header.
 */
export default function InvoiceDetailHeader() {
  const {
    invoice: {
      formatted_amount,
      invoice_no,
      customer,
      formatted_invoice_date,
      formatted_due_date,
      formatted_due_amount,
    },
  } = useInvoiceDetailDrawerContext();

  return (
    <DetailsMenu>
      <Card>
        <div className="details-menu--vertical">
          <DetailItem label={intl.get('amount')}>{formatted_amount}</DetailItem>
          <DetailItem label={intl.get('invoice_no')}>{invoice_no}</DetailItem>
          <DetailItem label={intl.get('customer_name')}>
            {customer?.display_name}
          </DetailItem>
          <DetailItem label={intl.get('invoice_date')}>
            {formatted_invoice_date}
          </DetailItem>
          <DetailItem label={intl.get('due_amount')}>
            {formatted_due_amount}
          </DetailItem>
          <DetailItem label={intl.get('due_date')}>
            {formatted_due_date}
          </DetailItem>
        </div>
      </Card>
    </DetailsMenu>
  );
}
