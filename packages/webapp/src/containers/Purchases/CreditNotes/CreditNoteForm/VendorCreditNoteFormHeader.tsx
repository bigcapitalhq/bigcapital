import React from 'react';
import intl from 'react-intl-universal';
import { useVendorCreditTotalFormatted } from './utils';
import { VendorCreditNoteFormHeaderFields } from './VendorCreditNoteFormHeaderFields';
import { PageFormBigNumber } from '@/components';
import { PageForm } from '@/components/PageForm';

/**
 * Vendor Credit note header.
 */
export function VendorCreditNoteFormHeader() {
  const totalFormatted = useVendorCreditTotalFormatted();

  return (
    <PageForm.Header>
      <VendorCreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('vendor_credits.label.amount_to_credit')}
        amount={totalFormatted}
      />
    </PageForm.Header>
  );
}
