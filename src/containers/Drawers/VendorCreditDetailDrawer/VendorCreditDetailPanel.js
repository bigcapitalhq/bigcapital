import React from 'react';

import { CommercialDocBox } from 'components';

import VendorCreditDetailHeader from './VendorCreditDetailHeader';
import VendorCreditDetailTable from './VendorCreditDetailTable';
import VendorCreditDetailDrawerFooter from './VendorCreditDetailDrawerFooter';

export default function VendorCreditDetailPanel() {
  return (
    <CommercialDocBox>
      <VendorCreditDetailHeader />
      <VendorCreditDetailTable />
      {/* <VendorCreditDetailDrawerFooter /> */}
    </CommercialDocBox>
  );
}
