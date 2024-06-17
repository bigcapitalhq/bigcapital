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
  ExchangeRateDetailItem,
  VendorDrawerLink,
} from '@/components';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made - detail panel - header.
 */
export default function PaymentMadeDetailHeader() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 class="big-number">{paymentMade.formatted_amount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_date')}
              children={paymentMade.formatted_payment_date}
            />
            <DetailItem
              label={intl.get('payment_made.details.payment_number')}
              children={defaultTo(paymentMade.payment_number, '-')}
            />
            <DetailItem label={intl.get('vendor_name')}>
              <VendorDrawerLink vendorId={paymentMade.vendor_id}>
                {paymentMade.vendor?.display_name}
              </VendorDrawerLink>
            </DetailItem>
            <DetailItem
              label={intl.get('payment_account')}
              children={paymentMade.payment_account?.name}
            />
            <ExchangeRateDetailItem
              exchangeRate={paymentMade?.exchange_rate}
              toCurrency={paymentMade?.currency_code}
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
              children={defaultTo(paymentMade.reference, '-')}
            />
            <DetailItem
              label={intl.get('created_at')}
              children={paymentMade.formatted_created_at}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
