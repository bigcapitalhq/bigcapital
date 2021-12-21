import React from 'react';
import moment from 'moment';
import { defaultTo } from 'lodash';

import {
  CommercialDocHeader,
  CommercialDocTopHeader,
  Row,
  Col,
  DetailItem,
  DetailsMenu,
  Money,
  FormattedMessage as T,
} from 'components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

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
            <h3 class="big-number">
              <Money
                amount={expense.total_amount}
                currency={expense.currency_code}
              />
            </h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem name={'date'} label={<T id={'date'} />}>
              {moment(expense.payment_date).format('YYYY MMM DD')}
            </DetailItem>

            <DetailItem name={'reference'} label={<T id={'reference_no'} />}>
              {defaultTo(expense.reference_no, '-')}
            </DetailItem>

            <DetailItem label={<T id={'published_at'} />}>
              {moment(expense.published_at).format('YYYY MMM DD')}
            </DetailItem>
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem label={<T id={'description'} />}>
              {defaultTo(expense.description, '—')}
            </DetailItem>
            <DetailItem label={<T id={'created_at'} />}>2021 Aug 24</DetailItem>
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
