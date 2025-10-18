// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';
import { Group, PageFormBigNumber } from '@/components';
import { useCreditNoteTotalFormatted } from './utils';
import { useIsDarkMode } from '@/hooks/useDarkMode';

/**
 * Credit note header.
 */
function CreditNoteFormHeader() {
  const isDarkMode = useIsDarkMode();

  return (
    <Group
      position="apart"
      align={'flex-start'}
      display="flex"
      p="25px 32px"
      bg="var(--x-credit-note-form-header-background)"
      borderBottom="1px solid var(--x-credit-note-form-header-border)"
      style={{
        '--x-credit-note-form-header-background': isDarkMode
          ? 'var(--color-dark-gray1)'
          : 'var(--color-white)',
        '--x-credit-note-form-header-border': isDarkMode
          ? 'rgba(255, 255, 255, 0.1)'
          : '#d2dce2',
      }}
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
