import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { VendorCreditDetailsStatus } from './utils';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import {
  T,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  VendorDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Vendor credit detail drawer header.
 */
export function VendorCreditDetailHeader() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();

  if (!vendorCredit) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountItem label={intl.get('amount')}>
            <span className="big-number">{vendorCredit.totalFormatted}</span>
          </AmountItem>
          <StatusItem>
            <VendorCreditDetailsStatus vendorCredit={vendorCredit} />
          </StatusItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('vendor_credit.drawer.label_vendor_credit_date')}
            >
              {vendorCredit.formattedVendorCreditDate}
            </DetailItem>
            <DetailItem
              label={intl.get('vendor_credit.drawer.label_vendor_credit_no')}
            >
              {defaultTo(vendorCredit.vendorCreditNumber, '-')}
            </DetailItem>

            <DetailItem label={intl.get('vendor_name')}>
              <VendorDrawerLink vendorId={vendorCredit.vendorId}>
                {vendorCredit.vendor?.displayName}
              </VendorDrawerLink>
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={vendorCredit?.exchangeRate}
              toCurrency={vendorCredit?.currencyCode}
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
              label={intl.get('vendor_credit.drawer.label_credits_remaining')}
            >
              <strong>{vendorCredit.formattedCreditsRemaining}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(vendorCredit.referenceNo, '-')}
            />
            <DetailItem
              label={intl.get('vendor_credit.drawer.label_created_at')}
              children={vendorCredit.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
`;

const AmountItem = styled(DetailItem)`
  width: 50%;
`;
