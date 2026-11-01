import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { ReceiptDetailsStatus } from './components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import {
  CustomerDrawerLink,
  CommercialDocHeader,
  CommercialDocTopHeader,
  ExchangeRateDetailItem,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
} from '@/components';

/**
 * Receipt details header.
 */
export function ReceiptDetailHeader() {
  const { receipt } = useReceiptDetailDrawerContext();

  if (!receipt) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountReceiptItem label={intl.get('amount')}>
            <h3 className="big-number">{receipt.totalFormatted}</h3>
          </AmountReceiptItem>

          <StatusReceiptItem>
            <ReceiptDetailsStatus receipt={receipt} />
          </StatusReceiptItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('receipt.details.receipt_number')}
              children={defaultTo(receipt.receiptNumber, '-')}
            />
            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={receipt.customerId}>
                {receipt.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>
            <DetailItem
              label={intl.get('receipt_date')}
              children={receipt.formattedReceiptDate}
            />
            <DetailItem
              label={intl.get('closed_date')}
              children={receipt.formattedClosedAtDate}
            />
            <ExchangeRateDetailItem
              exchangeRate={receipt?.exchangeRate}
              toCurrency={receipt?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'180px'}
            textAlign={'right'}
          >
            <DetailItem
              label={intl.get('deposit_account')}
              children={receipt.depositAccount?.name}
            />
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(receipt.referenceNo, '--')}
            />
            <DetailItem
              label={intl.get('receipt.details.created_at')}
              children={receipt.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const AmountReceiptItem = styled(DetailItem)`
  width: 50%;
`;

const StatusReceiptItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
`;
