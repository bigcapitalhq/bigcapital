// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';

import { getEntriesTotal } from '@/containers/Entries/utils';
import { Group, PageFormBigNumber } from '@/components';

/**
 * Credit note header.
 */
function CreditNoteFormHeader() {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      display="flex"
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <CreditNoteFormHeaderFields />
      <CreditNoteFormBigNumber />
    </Group>
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
