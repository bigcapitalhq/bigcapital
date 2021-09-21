import React from 'react';
import moment from 'moment';
import { defaultTo } from 'lodash';

import { DetailItem, DetailsMenu, Money } from 'components';
import { FormattedMessage as T } from 'components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

/**
 * Expense drawer content.
 */
export default function ExpenseDrawerHeader() {
  const {
    expense: {
      total_amount,
      payment_date,
      currency_code,
      reference_no,
      description,
      published_at,
    },
  } = useExpenseDrawerContext();

  return (
    <div className={'expense-drawer__content-header'}>
      <DetailsMenu>
        <DetailItem name={'amount'} label={<T id={'full_amount'} />}>
          <h3 class="big-number">
            <Money amount={total_amount} currency={currency_code} />
          </h3>
        </DetailItem>

        <DetailItem name={'date'} label={<T id={'date'} />}>
          {moment(payment_date).format('YYYY MMM DD')}
        </DetailItem>

        <DetailItem name={'currency'} label={<T id={'currency'} />}>
          {currency_code}
        </DetailItem>

        <DetailItem name={'reference'} label={<T id={'reference_no'} />}>
          {defaultTo(reference_no, '-')}
        </DetailItem>

        <DetailItem label={<T id={'published_at'} />}>
          {moment(published_at).format('YYYY MMM DD')}
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'}>
        <DetailItem label={<T id={'description'} />}>
          {defaultTo(description, '—')}
        </DetailItem>
        <DetailItem label={<T id={'created_at'} />}>2021 Aug 24</DetailItem>
      </DetailsMenu>
    </div>
  );
}
