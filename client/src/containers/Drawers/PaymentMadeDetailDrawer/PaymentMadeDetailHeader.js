import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

import { defaultTo } from 'lodash';

import { DetailsMenu, DetailItem } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made detail header.
 */
export default function PaymentMadeDetailHeader() {
  const {
    paymentMade: {
      formatted_amount,
      payment_number,
      payment_account,
      formatted_payment_date,
      vendor,
      created_at,
      statement,
    },
  } = usePaymentMadeDetailContext();

  return (
    <div className={'payment-drawer__content-header'}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <h3 class="big-number">{formatted_amount}</h3>
        </DetailItem>
        <DetailItem label={intl.get('payment_receive_no')}>
          {payment_number}
        </DetailItem>
        <DetailItem label={intl.get('customer_name')}>
          {vendor?.display_name}
        </DetailItem>
        <DetailItem label={intl.get('payment_account')}>
          {payment_account?.name}
        </DetailItem>
        <DetailItem label={intl.get('payment_date')}>
          {formatted_payment_date}
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'}>
        <DetailItem label={intl.get('description')}>
          {defaultTo(statement, '—')}
        </DetailItem>
        <DetailItem label={intl.get('created_at')}>
          {moment(created_at).format('YYYY MMM DD')}
        </DetailItem>
      </DetailsMenu>
    </div>
  );
}
