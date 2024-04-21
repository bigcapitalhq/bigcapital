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
      <div className="total-lines">
        <div className="total-lines__line total-lines__line--subtotal">
          <div className="title">
            <T id={'manual_journal.details.subtotal'} />
          </div>
          <div className="debit">
            <FormatNumber value={formatted_amount} />
          </div>
          <div className="credit">
            <FormatNumber value={formatted_amount} />
          </div>
        </div>
        <div className="total-lines__line total-lines__line--total">
          <div className="title">
            <T id={'manual_journal.details.total'} />
          </div>
          <div className="debit">{formatted_amount}</div>
          <div className="credit">{formatted_amount}</div>
        </div>
      </div>
    </div>
  );
}
