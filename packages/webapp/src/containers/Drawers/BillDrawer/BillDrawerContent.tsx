import React from 'react';
import { BillDetails as BillDrawerDetails } from './BillDrawerDetails';
import { BillDrawerProvider } from './BillDrawerProvider';
import { DrawerBody } from '@/components';

interface BillDrawerContentProps {
  billId: number | undefined;
}

/**
 * Bill drawer content.
 */
export function BillDrawerContent({ billId }: BillDrawerContentProps) {
  return (
    <BillDrawerProvider billId={billId}>
      <DrawerBody>
        <BillDrawerDetails />
      </DrawerBody>
    </BillDrawerProvider>
  );
}
