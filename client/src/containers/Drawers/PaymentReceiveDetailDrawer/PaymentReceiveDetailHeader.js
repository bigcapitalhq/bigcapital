import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';

import { defaultTo } from 'lodash';

import { Card, DetailsMenu, DetailItem } from 'components';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail header.
 */
export default function PaymentReceiveDetailHeader() {
  const {
    paymentReceive: {
      formatted_amount,
      payment_receive_no,
      customer,
      deposit_account,
      formatted_payment_date,
      statement,
      created_at,
    },
  } = usePaymentReceiveDetailContext();

  return (
    <div className={'payment-drawer__content-header'}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <h3 class="big-number">{formatted_amount}</h3>
        </DetailItem>
        <DetailItem label={intl.get('payment_receive_no')}>
          {payment_receive_no}
        </DetailItem>
        <DetailItem label={intl.get('customer_name')}>
          {customer?.display_name}
        </DetailItem>
        <DetailItem label={intl.get('deposit_account')}>
          {deposit_account?.name}
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
