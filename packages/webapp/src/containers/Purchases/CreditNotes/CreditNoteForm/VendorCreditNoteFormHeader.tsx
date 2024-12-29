// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import VendorCreditNoteFormHeaderFields from './VendorCreditNoteFormHeaderFields';
import { PageFormBigNumber } from '@/components';
import { useVendorCreditTotalFormatted } from './utils';

/**
 * Vendor Credit note header.
 */
function VendorCreditNoteFormHeader() {
  const totalFormatted = useVendorCreditTotalFormatted();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <VendorCreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('vendor_credits.label.amount_to_credit')}
        amount={totalFormatted}
      />
    </div>
  );
}

export default VendorCreditNoteFormHeader;
