// @ts-nocheck
import React from 'react';
import {
  Group,
  PageForm,
  PageFormBigNumber,
  FormattedMessage as T,
} from '@/components';
import MakeJournalEntriesHeaderFields from './MakeJournalEntriesHeaderFields';
import { useManualJournalTotalFormatted } from './utils';

export default function MakeJournalEntriesHeader() {
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
    <PageFormBigNumber label={<T id={'amount'} />} amount={totalFormatted} />
  );
}
