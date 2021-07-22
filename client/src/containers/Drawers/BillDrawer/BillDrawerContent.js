import React from 'react';
import { BillDrawerProvider } from './BillDrawerProvider';
import BillDrawerDetails from './BillDrawerDetails';
/**
 * Bill drawer content.
 */
export default function BillDrawerContent({
  // #ownProp
  billId,
}) {
  return (
    <BillDrawerProvider billId={billId}>
      <BillDrawerDetails />
    </BillDrawerProvider>
  );
}
