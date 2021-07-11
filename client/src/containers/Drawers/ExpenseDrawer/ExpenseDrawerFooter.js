import React from 'react';
import { If, Money } from 'components';
import { FormattedMessage as T } from 'components';

export default function ExpenseDrawerFooter({
  expense: { total_amount, currency_code },
}) {
  return (
    <div className="expense-drawer__content--footer">
      <div className="wrapper">
        <div>
          <span><T id={'sub_total'}/></span>
          <p>{<Money amount={total_amount} currency={currency_code} />}</p>
        </div>
        <div>
          <span><T id={'total'}/></span>
          <p>{<Money amount={total_amount} currency={currency_code} />}</p>
        </div>
      </div>
    </div>
  );
}
