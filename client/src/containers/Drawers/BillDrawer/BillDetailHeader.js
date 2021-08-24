import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, Card, DetailsMenu, DetailItem } from 'components';

import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Bill detail header.
 */
export default function BillDetailHeader() {
  const {
    bill: {
      vendor,
      bill_number,
      formatted_amount,
      formatted_bill_date,
      formatted_due_amount,
      formatted_due_date,
      formatted_payment_amount,
    },
  } = useBillDrawerContext();

  return (
    <DetailsMenu>
      <Card>
        <div className="details-menu--vertical">
          <DetailItem label={intl.get('amount')}>{formatted_amount}</DetailItem>
          <DetailItem label={intl.get('bill_number')}>{bill_number}</DetailItem>
          <DetailItem label={intl.get('bill_date')}>
            {formatted_bill_date}
          </DetailItem>
          <DetailItem label={intl.get('vendor_name')}>
            {vendor?.display_name}
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
