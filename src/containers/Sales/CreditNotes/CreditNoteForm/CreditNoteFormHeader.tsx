import React from 'react';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from '@/common/classes';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';

import { getEntriesTotal } from '@/containers/Entries/utils';
import { PageFormBigNumber } from '@/components';

/**
 * Credit note header.
 */
function CreditNoteFormHeader() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <CreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('credit_note.label_amount_to_credit')}
        amount={totalAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}

export default CreditNoteFormHeader;
