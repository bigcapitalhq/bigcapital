// @ts-nocheck
import React from 'react';

import { CommercialDocBox } from '@/components';

import VendorCreditDetailHeader from './VendorCreditDetailHeader';
import VendorCreditDetailTable from './VendorCreditDetailTable';
import VendorCreditDetailDrawerFooter from './VendorCreditDetailDrawerFooter';
import { VendorCreditDetailFooter } from './VendorCreditDetailFooter';

/**
 * Vendor credit details panel.
 * @returns {React.JSX}
 */
export default function VendorCreditDetailPanel() {
  return (
    <CommercialDocBox>
      <VendorCreditDetailHeader />
      <VendorCreditDetailTable />
      <VendorCreditDetailDrawerFooter />
      <VendorCreditDetailFooter />
    </CommercialDocBox>
  );
}
