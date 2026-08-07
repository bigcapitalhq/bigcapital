import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { ExpenseDetailsStatus } from './components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import {
  CommercialDocHeader,
  CommercialDocTopHeader,
  Row,
  Col,
  DetailItem,
  DetailsMenu,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Expense drawer content.
 */
export function ExpenseDrawerHeader() {
  const { expense } = useExpenseDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem name={'amount'} label={intl.get('full_amount')}>
            <h3 className="big-number">{expense?.formattedAmount}</h3>
          </DetailItem>

          <StatusDetailItem>
            <ExpenseDetailsStatus expense={expense} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem name={'date'} label={intl.get('date')}>
              {expense?.formattedDate}
            </DetailItem>

            <DetailItem name={'reference'} label={intl.get('reference_no')}>
              {defaultTo(expense?.referenceNo, '-')}
            </DetailItem>

            <DetailItem label={intl.get('description')}>
              {defaultTo(expense?.description, '—')}
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={expense?.exchangeRate}
              toCurrency={expense?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem label={intl.get('published_at')}>
              {expense?.formattedPublishedAt || '—'}
            </DetailItem>

            <DetailItem label={intl.get('created_at')}>
              {expense?.formattedCreatedAt}
            </DetailItem>
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
