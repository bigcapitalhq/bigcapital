import React from 'react';
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
