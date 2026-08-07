import React from 'react';
import intl from 'react-intl-universal';
import { MakeJournalEntriesHeader as MakeJournalEntriesHeaderFields } from './MakeJournalEntriesHeaderFields';
import { useManualJournalTotalFormatted } from './utils';
import { PageForm, PageFormBigNumber } from '@/components';

export function MakeJournalEntriesHeader() {
  return (
    <PageForm.Header>
      <MakeJournalEntriesHeaderFields />
      <MakeJournalHeaderBigNumber />
    </PageForm.Header>
  );
}

/**
 * Big total number of make journal header.
 * @returns {React.ReactNode}
 */
function MakeJournalHeaderBigNumber() {
  const totalFormatted = useManualJournalTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('amount')} amount={totalFormatted} />
  );
}
