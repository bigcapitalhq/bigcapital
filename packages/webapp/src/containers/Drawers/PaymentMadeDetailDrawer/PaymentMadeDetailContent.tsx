import React from 'react';
import { PaymentMadeDetailProvider } from './PaymentMadeDetailProvider';
import { PaymentMadeDetail as PaymentMadeDetails } from './PaymentMadeDetails';
import { DrawerBody } from '@/components';

interface PaymentMadeDetailContentProps {
  paymentMadeId: number | undefined;
}

/**
 * Payment made detail content.
 */
export function PaymentMadeDetailContent({
  // #ownProp
  paymentMadeId,
}: PaymentMadeDetailContentProps) {
  return (
    <PaymentMadeDetailProvider paymentMadeId={paymentMadeId}>
      <DrawerBody>
        <PaymentMadeDetails />
      </DrawerBody>
    </PaymentMadeDetailProvider>
  );
}
