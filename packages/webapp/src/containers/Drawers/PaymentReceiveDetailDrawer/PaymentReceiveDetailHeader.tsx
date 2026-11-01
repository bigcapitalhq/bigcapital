import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';
import {
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Payment receive detail header.
 */
export function PaymentReceiveDetailHeader() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  if (!paymentReceive) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 className="big-number">{paymentReceive.formattedAmount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_date')}
              children={paymentReceive.formattedPaymentDate}
            />
            <DetailItem
              label={intl.get('payment_receive.details.payment_number')}
              children={defaultTo(paymentReceive.paymentReceiveNo, '-')}
            />
            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={paymentReceive.customerId}>
                {paymentReceive.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem
              label={intl.get('deposit_account')}
              children={paymentReceive.depositAccount?.name}
            />
            <ExchangeRateDetailItem
              exchangeRate={paymentReceive?.exchangeRate}
              toCurrency={paymentReceive?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(paymentReceive.referenceNo, '-')}
            />
            <DetailItem
              label={intl.get('created_at')}
              children={paymentReceive.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
