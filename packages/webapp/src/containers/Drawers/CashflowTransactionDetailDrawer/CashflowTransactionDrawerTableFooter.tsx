// @ts-nocheck
import React from 'react';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { T, FormatNumber } from '@/components';

export function CashflowTransactionDrawerTableFooter() {
  const {
    cashflowTransaction: { formattedAmount },
  } = useCashflowTransactionDrawerContext();

  return (
    <div className="cashflow-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">
            <T id={'manual_journal.details.subtotal'} />
          </div>
          <div class="debit">
            <FormatNumber value={formattedAmount} />
          </div>
          <div class="credit">
            <FormatNumber value={formattedAmount} />
          </div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">
            <T id={'manual_journal.details.total'} />
          </div>
          <div class="debit">{formattedAmount}</div>
          <div class="credit">{formattedAmount}</div>
        </div>
      </div>
    </div>
  );
}
