import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import { InvoiceDetailsStatus } from './utils';
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

export function InvoiceDetailHeader() {
  const { invoice } = useInvoiceDetailDrawerContext();

  if (!invoice) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('amount')}>
            <h3 className="big-number">{invoice.totalFormatted}</h3>
          </AmountDetailItem>

          <StatusDetailItem label={''}>
            <InvoiceDetailsStatus invoice={invoice} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('invoice_date')}>
              {invoice.invoiceDateFormatted}
            </DetailItem>

            <DetailItem label={intl.get('due_date')}>
              {invoice.dueDateFormatted}
            </DetailItem>

            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={invoice.customerId}>
                {invoice.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem label={intl.get('invoice.details.invoice_no')}>
              {invoice.invoiceNo}
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={invoice?.exchangeRate}
              toCurrency={invoice?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'180px'}
            textAlign={'right'}
          >
            <DetailItem label={intl.get('due_amount')}>
              <strong>{invoice.dueAmountFormatted}</strong>
            </DetailItem>

            <DetailItem label={intl.get('invoice.details.payment_amount')}>
              <strong>{invoice.paymentAmountFormatted}</strong>
            </DetailItem>

            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(invoice.referenceNo, '--')}
            />
            <DetailItem
              label={intl.get('invoice.details.created_at')}
              children={invoice.createdAtFormatted}
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
