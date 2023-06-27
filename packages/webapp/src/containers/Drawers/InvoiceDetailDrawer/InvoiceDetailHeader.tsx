// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  ButtonLink,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  FormatDate,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import { InvoiceDetailsStatus } from './utils';

/**
 * Invoice detail header.
 */
export default function InvoiceDetailHeader() {
  const { invoice } = useInvoiceDetailDrawerContext();

  const handleCustomerLinkClick = () => {};

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('amount')}>
            <h3 class="big-number">{invoice.formatted_amount}</h3>
          </AmountDetailItem>

          <StatusDetailItem label={''}>
            <InvoiceDetailsStatus invoice={invoice} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('invoice_date')}>
              <FormatDate value={invoice.invoice_date} />
            </DetailItem>

            <DetailItem label={intl.get('due_date')}>
              <FormatDate value={invoice.due_date} />
            </DetailItem>

            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={invoice.customer_id}>
                {invoice.customer?.display_name}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem label={intl.get('invoice.details.invoice_no')}>
              {invoice.invoice_no}
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={invoice?.exchange_rate}
              toCurrency={invoice?.currency_code}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            direction={'horizontal'}
            minLabelSize={'180px'}
            textAlign={'right'}
          >
            <DetailItem label={intl.get('due_amount')}>
              <strong>{invoice.formatted_due_amount}</strong>
            </DetailItem>

            <DetailItem label={intl.get('invoice.details.payment_amount')}>
              <strong>{invoice.formatted_payment_amount}</strong>
            </DetailItem>

            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(invoice.reference_no, '--')}
            />
            <DetailItem
              label={intl.get('invoice.details.created_at')}
              children={<FormatDate value={invoice.created_at} />}
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
