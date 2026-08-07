import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { EstimateDetailsStatus } from './components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import {
  CommercialDocHeader,
  CommercialDocTopHeader,
  DetailsMenu,
  DetailItem,
  Row,
  Col,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Estimate read-only details drawer header.
 */
export function EstimateDetailHeader() {
  const { estimate } = useEstimateDetailDrawerContext();

  if (!estimate) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountEstimateDetail label={intl.get('amount')}>
            <span className="big-number">{estimate.totalFormatted}</span>
          </AmountEstimateDetail>

          <EstimateStatusDetail>
            <EstimateDetailsStatus estimate={estimate} />
          </EstimateStatusDetail>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('estimate.details.estimate_number')}
              children={defaultTo(estimate.estimateNumber, '-')}
            />

            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={estimate.customerId}>
                {estimate.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem
              label={intl.get('estimate_date')}
              children={estimate.formattedEstimateDate}
            />

            <DetailItem
              label={intl.get('expiration_date')}
              children={estimate.formattedExpirationDate}
            />
            <ExchangeRateDetailItem
              exchangeRate={estimate?.exchangeRate}
              toCurrency={estimate?.currencyCode}
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
              children={defaultTo(estimate.reference, '-')}
            />
            <DetailItem
              label={intl.get('estimate.details.created_at')}
              children={estimate.formattedCreatedAt}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const EstimateStatusDetail = styled(DetailItem)`
  width: 50%;
  text-align: right;
`;
const AmountEstimateDetail = styled(DetailItem)`
  width: 50%;
`;
