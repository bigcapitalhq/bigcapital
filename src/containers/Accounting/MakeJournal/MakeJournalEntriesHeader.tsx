import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';
import { safeSumBy } from '@/utils';
import { PageFormBigNumber, FormattedMessage as T } from '@/components';
import MakeJournalEntriesHeaderFields from './MakeJournalEntriesHeaderFields';

export default function MakeJournalEntriesHeader() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();
  const totalCredit = safeSumBy(entries, 'credit');
  const totalDebit = safeSumBy(entries, 'debit');

  const total = Math.max(totalCredit, totalDebit);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <MakeJournalEntriesHeaderFields />

      <PageFormBigNumber
        label={<T id={'amount'} />}
        amount={total}
        currencyCode={currency_code}
      />
    </div>
  );
}
