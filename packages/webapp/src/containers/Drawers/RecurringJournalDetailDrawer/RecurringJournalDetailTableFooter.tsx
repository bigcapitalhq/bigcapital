import React from 'react';
import styled from 'styled-components';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import {
  FormattedMessage as T,
  TotalLine,
  TotalLineBorderStyle,
  TotalLines,
  TotalLineTextStyle,
} from '@/components';

/**
 * Recurring journal details totals footer.
 */
export function RecurringJournalDetailTableFooter() {
  const { recurringJournal } = useRecurringJournalDetailDrawerContext();

  if (!recurringJournal) {
    return null;
  }

  return (
    <RecurringJournalDetailsFooterRoot>
      <RecurringJournalTotalLines
        labelColWidth={'180px'}
        amountColWidth={'180px'}
      >
        <TotalLine
          title={<T id={'recurring_journal.details.subtotal'} />}
          value={recurringJournal.amountFormatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'recurring_journal.details.total'} />}
          value={recurringJournal.amountFormatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </RecurringJournalTotalLines>
    </RecurringJournalDetailsFooterRoot>
  );
}

const RecurringJournalDetailsFooterRoot = styled.div``;

const RecurringJournalTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
