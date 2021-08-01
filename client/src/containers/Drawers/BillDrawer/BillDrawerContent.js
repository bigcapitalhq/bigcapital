import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import { BillDrawerProvider } from './BillDrawerProvider';
import BillDrawerDetails from './BillDrawerDetails';
import BillDrawerAlerts from './BillDrawerAlerts';

/**
 * Bill drawer content.
 */
export default function BillDrawerContent({
  // #ownProp
  bill,
}) {
  return (
    <BillDrawerProvider billId={bill}>
      <BillDrawerDetails />
      <BillDrawerAlerts />
    </BillDrawerProvider>
  );
}
