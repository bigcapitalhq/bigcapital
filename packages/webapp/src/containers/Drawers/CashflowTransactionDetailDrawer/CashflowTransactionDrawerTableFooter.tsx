// @ts-nocheck
import React from 'react';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { T, FormatNumber } from '@/components';

export default function CashflowTransactionDrawerTableFooter() {
  const {
    cashflowTransaction: { formatted_amount },
  } = useCashflowTransactionDrawerContext();

  return (
    <div className="cashflow-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">
            <T id={'manual_journal.details.subtotal'} />
          </div>
          <div class="debit">
            <FormatNumber value={formatted_amount} />
          </div>
          <div class="credit">
            <FormatNumber value={formatted_amount} />
          </div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">
            <T id={'manual_journal.details.total'} />
          </div>
          <div class="debit">{formatted_amount}</div>
          <div class="credit">{formatted_amount}</div>
        </div>
      </div>
    </div>
  );
}
