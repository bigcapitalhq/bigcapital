import React from 'react';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

import { T, FormatNumber } from '../../../components';

/**
 * Manual journal readonly details footer.
 */
export default function ManualJournalDrawerFooter() {
  const {
    manualJournal: { amount, formatted_amount },
  } = useManualJournalDrawerContext();

  return (
    <div className="journal-drawer__content-footer">
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
          <div class="debit">{formatted_amount}</div>
          <div class="credit">{formatted_amount}</div>
        </div>
      </div>
    </div>
  );
}
