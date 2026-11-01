import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useBillDrawerContext } from './BillDrawerProvider';
import { BillDetailsStatus } from './utils';
import {
  FormatDate,
  DetailsMenu,
  DetailItem,
  Row,
  Col,
  CommercialDocHeader,
  CommercialDocTopHeader,
  VendorDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Bill detail header.
 */
export function BillDetailHeader() {
  const { bill } = useBillDrawerContext();

  if (!bill) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('amount')}>
            <h3 className="big-number">{bill.totalFormatted}</h3>
          </AmountDetailItem>
          <StatusDetailItem>
            <BillDetailsStatus bill={bill} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>
      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('bill_date')}>
              {bill.formattedBillDate}
            </DetailItem>

            <DetailItem label={intl.get('due_date')}>
              {bill.formattedDueDate}
            </DetailItem>

            <DetailItem label={intl.get('vendor_name')}>
              <VendorDrawerLink vendorId={bill.vendorId}>
                {bill.vendor?.displayName}
              </VendorDrawerLink>
            </DetailItem>

            <DetailItem label={intl.get('bill.details.bill_number')}>
              {defaultTo(bill.billNumber, '-')}
            </DetailItem>

            <ExchangeRateDetailItem
              exchangeRate={bill?.exchangeRate}
              toCurrency={bill?.currencyCode}
            />
          </DetailsMenu>
        </Col>
        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'140px'}
            textAlign={'right'}
          >
            <DetailItem label={intl.get('due_amount')}>
              <strong>{bill.formattedDueAmount}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(bill.referenceNo, '--')}
            />
            <DetailItem
              label={intl.get('bill.details.created_at')}
              children={bill.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusDetailItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
  position: relative;
  top: -5px;
`;

const AmountDetailItem = styled(DetailItem)`
  width: 50%;
`;
