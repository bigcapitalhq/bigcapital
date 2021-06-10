import React from 'react';
import moment from 'moment';
import { If, Money } from 'components';
import { FormattedMessage as T } from 'components';

/**
 * Expense drawer content.
 */
export default function ExpenseDrawerHeader({
  expense: {
    total_amount,
    payment_account: { name },
    payment_date,
    currency_code,
    reference_no,
    description,
    published_at,
  },
}) {
  return (
    <div className={'expense-drawer__content--header'}>
      <div className={'info'}>
        <span>
          <T id={'full_amount'} />
        </span>
        <p className="balance">
          {<Money amount={total_amount} currency={currency_code} />}
        </p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'date'} />
        </span>
        <p>{moment(payment_date).format('YYYY MMM DD')}</p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'payment_account_'} />
        </span>
        <p>{name}</p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'currency'} />
        </span>
        <p>{currency_code}</p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'reference_no'} />
        </span>
        <p>{reference_no}</p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'published_at'} />
        </span>
        <p>{moment(published_at).format('YYYY MMM DD')}</p>
      </div>
      <div className={'info'}>
        <span>
          <T id={'description'} />
        </span>
        <p>{description}</p>
      </div>
    </div>
  );
}
