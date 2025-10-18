// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import VendorCreditNoteFormHeaderFields from './VendorCreditNoteFormHeaderFields';
import { PageForm } from '@/components/PageForm';
import { PageFormBigNumber } from '@/components';
import { useVendorCreditTotalFormatted } from './utils';

/**
 * Vendor Credit note header.
 */
function VendorCreditNoteFormHeader() {
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

export default VendorCreditNoteFormHeader;
