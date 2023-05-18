// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';

import { getEntriesTotal } from '@/containers/Entries/utils';
import { PageFormBigNumber } from '@/components';

/**
 * Credit note header.
 */
function CreditNoteFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <CreditNoteFormHeaderFields />
      <CreditNoteFormBigNumber />
    </div>
  );
}

/**
 * Big total number of credit note form header.
 * @returns {React.ReactNode}
 */
function CreditNoteFormBigNumber() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <PageFormBigNumber
      label={intl.get('credit_note.label_amount_to_credit')}
      amount={totalAmount}
      currencyCode={currency_code}
    />
  );
}

export default CreditNoteFormHeader;
