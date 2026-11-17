import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import { CommercialDocFooter, DetailItem, DetailsMenu, If } from '@/components';

/**
 * Recurring journal details footer.
 */
export function RecurringJournalDetailFooter() {
  const { recurringJournal } = useRecurringJournalDetailDrawerContext();

  if (!recurringJournal) {
    return null;
  }

  if (!recurringJournal.description && !recurringJournal.lastError) {
    return null;
  }

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={!!recurringJournal.description}>
          <DetailItem label={intl.get('description')} multiline>
            {recurringJournal.description}
          </DetailItem>
        </If>

        <If condition={!!recurringJournal.lastError}>
          <DetailItem
            label={intl.get('recurring_journal.field.last_error')}
            multiline
          >
            {recurringJournal.lastError}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
