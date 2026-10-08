import React from 'react';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { T, FormatNumber } from '@/components';

export function CashflowTransactionDrawerTableFooter() {
  const { cashflowTransaction } = useCashflowTransactionDrawerContext();
  const formattedAmount = cashflowTransaction?.formattedAmount;

  return (
    <div className="cashflow-drawer__content-footer">
      <div className="total-lines">
        <div className="total-lines__line total-lines__line--subtotal">
          <div className="title">
            <T id={'manual_journal.details.subtotal'} />
          </div>
          <div className="debit">
            <FormatNumber value={formattedAmount} noZero={false} />
          </div>
          <div className="credit">
            <FormatNumber value={formattedAmount} noZero={false} />
          </div>
        </div>
        <div className="total-lines__line total-lines__line--total">
          <div className="title">
            <T id={'manual_journal.details.total'} />
          </div>
          <div className="debit">{formattedAmount}</div>
          <div className="credit">{formattedAmount}</div>
        </div>
      </div>
    </div>
  );
}
