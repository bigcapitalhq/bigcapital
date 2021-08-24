import React from 'react';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

export default function ExpenseDrawerFooter() {
  const { expense: { total_amount } } = useExpenseDrawerContext();

  return (
    <div className="expense-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">Subtotal</div>
          <div class="amount">{total_amount}</div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">TOTAL</div>
          <div class="amount">{total_amount}</div>
        </div>
      </div>
    </div>
  );
}
