import React from 'react';
import { T } from 'components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

import { FormatNumber } from '../../../components';

/**
 * Footer details of expense readonly details.
 */
export default function ExpenseDrawerFooter() {
  const { expense } = useExpenseDrawerContext();

  return (
    <div className="expense-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">
            <T id={'expense.details.subtotal'} />
          </div>
          <div class="amount">
            {<FormatNumber value={expense.total_amount} />}
          </div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">
            <T id={'expense.details.total'} />
          </div>
          <div class="amount">{expense.formatted_amount}</div>
        </div>
      </div>
    </div>
  );
}
