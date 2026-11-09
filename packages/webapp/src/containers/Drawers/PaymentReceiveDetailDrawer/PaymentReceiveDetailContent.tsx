import React from 'react';
import { PaymentReceiveDetail } from './PaymentReceiveDetail';
import { PaymentReceiveDetailProvider } from './PaymentReceiveDetailProvider';
import { DrawerBody } from '@/components';

interface PaymentReceiveDetailContentProps {
  paymentReceiveId: number | undefined;
}

/**
 * Payment receive detail content.
 */
export function PaymentReceiveDetailContent({
  // #ownProp
  paymentReceiveId,
}: PaymentReceiveDetailContentProps) {
  return (
    <PaymentReceiveDetailProvider paymentReceiveId={paymentReceiveId}>
      <DrawerBody>
        <PaymentReceiveDetail />
      </DrawerBody>
    </PaymentReceiveDetailProvider>
  );
}
