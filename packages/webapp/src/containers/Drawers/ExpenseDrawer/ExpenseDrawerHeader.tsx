// @ts-nocheck
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  CommercialDocHeader,
  CommercialDocTopHeader,
  Row,
  Col,
  DetailItem,
  DetailsMenu,
  FormatDate,
  ExchangeRateDetailItem,
  FormattedMessage as T,
} from '@/components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import { ExpenseDetailsStatus } from './components';

/**
 * Expense drawer content.
 */
export default function ExpenseDrawerHeader() {
  const { expense } = useExpenseDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem name={'amount'} label={<T id={'full_amount'} />}>
            <h3 class="big-number">{expense.formatted_amount}</h3>
          </DetailItem>

          <StatusDetailItem>
            <ExpenseDetailsStatus expense={expense} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem name={'date'} label={<T id={'date'} />}>
              {moment(expense.payment_date).format('YYYY MMM DD')}
            </DetailItem>

            <DetailItem name={'reference'} label={<T id={'reference_no'} />}>
              {defaultTo(expense.reference_no, '-')}
            </DetailItem>

            <DetailItem label={<T id={'description'} />}>
              {defaultTo(expense.description, '—')}
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={expense?.exchange_rate}
              toCurrency={expense?.currency_code}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizontal'}
            minLabelSize={'180px'}
          >
            <DetailItem label={<T id={'published_at'} />}>
              <FormatDate value={expense.published_at} />
            </DetailItem>

            <DetailItem label={<T id={'created_at'} />}>
              <FormatDate value={expense.created_at} />
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
