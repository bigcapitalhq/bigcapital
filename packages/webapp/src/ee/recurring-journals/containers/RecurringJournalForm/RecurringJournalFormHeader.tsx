import React from 'react';
import intl from 'react-intl-universal';
import { RecurringJournalFormFields } from './RecurringJournalFormFields';
import { useRecurringJournalTotalFormatted } from './utils';
import { PageForm, PageFormBigNumber } from '@/components';

/**
 * Recurring journal form header.
 */
export function RecurringJournalFormHeader() {
  return (
    <PageForm.Header>
      <RecurringJournalFormFields />
      <RecurringJournalHeaderBigNumber />
    </PageForm.Header>
  );
}

/**
 * Big total number of recurring journal header.
 * @returns {React.ReactNode}
 */
function RecurringJournalHeaderBigNumber() {
  const totalFormatted = useRecurringJournalTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('amount')} amount={totalFormatted} />
  );
}
