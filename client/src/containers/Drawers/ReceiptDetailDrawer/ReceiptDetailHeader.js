import React from 'react';
import intl from 'react-intl-universal';

import { Card, DetailsMenu, DetailItem } from 'components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

/**
 * receipt detail content.
 */
export default function ReceiptDetailHeader() {
  const {
    receipt: {
      formatted_amount,
      receipt_no,
      customer,
      deposit_account,
      formatted_receipt_date,
      formatted_closed_at_date,
      entries,
    },
  } = useReceiptDetailDrawerContext();

  return (
    <DetailsMenu>
      <Card>
        <div className="details-menu--vertical">
          <DetailItem label={intl.get('amount')}>{formatted_amount}</DetailItem>
          <DetailItem label={intl.get('receipt_no')}>{receipt_no}</DetailItem>
          <DetailItem label={intl.get('customer_name')}>
            {customer?.display_name}
          </DetailItem>
          <DetailItem label={intl.get('deposit_account')}>
            {deposit_account?.name}
          </DetailItem>
          <DetailItem label={intl.get('receipt_date')}>
            {formatted_receipt_date}
          </DetailItem>
          <DetailItem label={intl.get('closed_date')}>
            {formatted_closed_at_date}
          </DetailItem>
        </div>
      </Card>
    </DetailsMenu>
  );
}
