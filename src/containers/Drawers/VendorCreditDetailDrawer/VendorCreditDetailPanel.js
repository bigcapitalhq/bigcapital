import React from 'react';

import { CommercialDocBox } from 'components';

import VendorCreditDetailHeader from './VendorCreditDetailHeader';
import VendorCreditDetailTable from './VendorCreditDetailTable';
import VendorCreditDetailDrawerFooter from './VendorCreditDetailDrawerFooter';

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
    </CommercialDocBox>
  );
}
