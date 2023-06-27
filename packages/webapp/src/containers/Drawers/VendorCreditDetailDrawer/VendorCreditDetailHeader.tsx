// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  FormatDate,
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
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import { VendorCreditDetailsStatus } from './utils';

/**
 * Vendor credit detail drawer header.
 */
export default function VendorCreditDetailHeader() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();
  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountItem label={intl.get('amount')}>
            <span class="big-number">{vendorCredit.formatted_amount}</span>
          </AmountItem>
          <StatusItem>
            <VendorCreditDetailsStatus vendorCredit={vendorCredit} />
          </StatusItem>
        </DetailsMenu>
      </CommercialDocTopHeader>
      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('vendor_credit.drawer.label_vendor_credit_date')}
            >
              <FormatDate value={vendorCredit.formatted_vendor_credit_date} />
            </DetailItem>
            <DetailItem
              label={intl.get('vendor_credit.drawer.label_vendor_credit_no')}
            >
              {defaultTo(vendorCredit.vendor_credit_number, '-')}
            </DetailItem>

            <DetailItem label={intl.get('vendor_name')}>
              <VendorDrawerLink vendorId={vendorCredit.vendor_id}>
                {vendorCredit.vendor?.display_name}
              </VendorDrawerLink>
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={vendorCredit?.exchange_rate}
              toCurrency={vendorCredit?.currency_code}
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
              label={intl.get('vendor_credit.drawer.label_credits_remaining')}
            >
              <strong>{vendorCredit.formatted_credits_remaining}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(vendorCredit.reference_no, '-')}
            />
            <DetailItem
              label={<T id={'vendor_credit.drawer.label_created_at'} />}
              children={<FormatDate value={vendorCredit.created_at} />}
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
