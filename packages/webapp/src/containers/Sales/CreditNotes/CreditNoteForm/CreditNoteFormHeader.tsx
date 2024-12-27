// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';
import { Group, PageFormBigNumber } from '@/components';
import { useCreditNoteTotalFormatted } from './utils';

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
  const totalFormatted = useCreditNoteTotalFormatted();

  return (
    <PageFormBigNumber
      label={intl.get('credit_note.label_amount_to_credit')}
      amount={totalFormatted}
    />
  );
}

export default CreditNoteFormHeader;
