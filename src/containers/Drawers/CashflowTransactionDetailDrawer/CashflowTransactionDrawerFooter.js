import React from 'react';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { T, FormatNumber } from '../../../components';

export default function CashflowTransactionDrawerFooter() {
  const {
    cashflowTransaction: { amount },
  } = useCashflowTransactionDrawerContext();

  return (
    <div className="cashflow-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">
            <T id={'manual_journal.details.subtotal'} />
          </div>
          <div class="debit">
            <FormatNumber value={amount} />
          </div>
          <div class="credit">
            <FormatNumber value={amount} />
          </div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">
            <T id={'manual_journal.details.total'} />
          </div>
          <div class="debit">{amount}</div>
          <div class="credit">{amount}</div>
        </div>
      </div>
    </div>
  );
}
