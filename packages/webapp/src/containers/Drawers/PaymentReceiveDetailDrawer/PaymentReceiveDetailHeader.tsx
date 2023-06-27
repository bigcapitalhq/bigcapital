// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';

import {
  Row,
  Col,
  FormatDate,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail header.
 */
export default function PaymentReceiveDetailHeader() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 class="big-number">{paymentReceive.formatted_amount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_date')}
              children={<FormatDate value={paymentReceive.payment_date} />}
            />
            <DetailItem
              label={intl.get('payment_receive.details.payment_number')}
              children={defaultTo(paymentReceive.payment_receive_no, '-')}
            />
            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={paymentReceive.customer_id}>
                {paymentReceive.customer?.display_name}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem
              label={intl.get('deposit_account')}
              children={paymentReceive.deposit_account?.name}
            />
            <ExchangeRateDetailItem
              exchangeRate={paymentReceive?.exchange_rate}
              toCurrency={paymentReceive?.currency_code}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizontal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(paymentReceive.reference_no, '-')}
            />
            <DetailItem
              label={intl.get('created_at')}
              children={<FormatDate value={paymentReceive.created_at} />}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
