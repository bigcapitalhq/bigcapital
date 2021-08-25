import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import clsx from 'classnames';
import { defaultTo } from 'lodash';

import { DetailsMenu, DetailItem } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made - detail panel - header.
 */
export default function PaymentMadeDetailHeader() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <h3 class="big-number" children={paymentMade.formatted_amount} />
        </DetailItem>
        <DetailItem
          label={intl.get('payment_made.details.payment_number')}
          children={defaultTo(paymentMade.payment_number, '-')}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={paymentMade.vendor?.display_name}
        />
        <DetailItem
          label={intl.get('payment_account')}
          children={paymentMade.payment_account?.name}
        />
        <DetailItem
          label={intl.get('payment_date')}
          children={paymentMade.formatted_payment_date}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'160px'}>
        <DetailItem
          label={intl.get('description')}
          children={defaultTo(paymentMade.statement, '-')}
        />
        <DetailItem
          label={intl.get('created_at')}
          children={moment(paymentMade.created_at).format('YYYY MMM DD')}
        />
      </DetailsMenu>
    </div>
  );
}
