// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { PageFormBigNumber, FormattedMessage as T } from '@/components';
import MakeJournalEntriesHeaderFields from './MakeJournalEntriesHeaderFields';
import { useManualJournalTotalFormatted } from './utils';

export default function MakeJournalEntriesHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <MakeJournalEntriesHeaderFields />
      <MakeJournalHeaderBigNumber />
    </div>
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
