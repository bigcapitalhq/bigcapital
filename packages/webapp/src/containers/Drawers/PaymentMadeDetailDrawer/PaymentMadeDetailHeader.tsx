import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';
import {
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  ExchangeRateDetailItem,
  VendorDrawerLink,
} from '@/components';

/**
 * Payment made - detail panel - header.
 */
export function PaymentMadeDetailHeader() {
  const { paymentMade } = usePaymentMadeDetailContext();

  if (!paymentMade) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 className="big-number">{paymentMade.formattedAmount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_date')}
              children={paymentMade.formattedPaymentDate}
            />
            <DetailItem
              label={intl.get('payment_made.details.payment_number')}
              children={defaultTo(paymentMade.paymentNumber, '-')}
            />
            <DetailItem label={intl.get('vendor_name')}>
              <VendorDrawerLink vendorId={paymentMade.vendorId}>
                {paymentMade.vendor?.displayName}
              </VendorDrawerLink>
            </DetailItem>
            <DetailItem
              label={intl.get('payment_account')}
              children={paymentMade.paymentAccount?.name}
            />
            <ExchangeRateDetailItem
              exchangeRate={paymentMade?.exchangeRate}
              toCurrency={paymentMade?.currencyCode}
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
              children={paymentMade.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
