import React from 'react';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

export default function ManualJournalDrawerFooter({}) {
  const {
    manualJournal: { amount },
  } = useManualJournalDrawerContext();

  return (
    <div className="journal-drawer__content-footer">
      <div class="total-lines">
        <div class="total-lines__line total-lines__line--subtotal">
          <div class="title">Subtotal</div>
          <div class="debit">{amount}</div>
          <div class="credit">{amount} </div>
        </div>
        <div class="total-lines__line total-lines__line--total">
          <div class="title">TOTAL</div>
          <div class="debit">{amount}</div>
          <div class="credit">{amount}</div>
        </div>
      </div>
    </div>
  );
}


