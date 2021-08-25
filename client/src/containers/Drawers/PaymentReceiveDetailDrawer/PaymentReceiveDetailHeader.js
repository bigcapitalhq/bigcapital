import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import clsx from 'classnames';

import { defaultTo } from 'lodash';

import { DetailsMenu, DetailItem } from 'components';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import PaymentDrawerCls from './PaymentReceiveDrawer.module.scss';

/**
 * Payment receive detail header.
 */
export default function PaymentReceiveDetailHeader() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem
          label={intl.get('amount')}
          children={
            <h3 class="big-number">{paymentReceive.formatted_amount}</h3>
          }
        />
        <DetailItem
          label={intl.get('payment_receive.details.payment_number')}
          children={defaultTo(paymentReceive.payment_receive_no, '-')}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={paymentReceive.customer?.display_name}
        />
        <DetailItem
          label={intl.get('deposit_account')}
          children={paymentReceive.deposit_account?.name}
        />
        <DetailItem
          label={intl.get('payment_date')}
          children={paymentReceive.formatted_payment_date}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'140px'}>
        <DetailItem
          label={intl.get('description')}
          children={defaultTo(paymentReceive.statement, '—')}
        />
        <DetailItem
          label={intl.get('created_at')}
          children={moment(paymentReceive.created_at).format('YYYY MMM DD')}
        />
      </DetailsMenu>
    </div>
  );
}
