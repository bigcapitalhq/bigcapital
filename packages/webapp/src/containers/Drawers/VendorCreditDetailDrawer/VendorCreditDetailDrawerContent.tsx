import React from 'react';
import { VendorCreditDetail } from './VendorCreditDetail';
import { VendorCreditDetailDrawerProvider } from './VendorCreditDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface VendorCreditDetailDrawerContentProps {
  vendorCreditId: number | undefined;
}

/**
 * Vendor credit detail drawer content.
 */
export function VendorCreditDetailDrawerContent({
  vendorCreditId,
}: VendorCreditDetailDrawerContentProps) {
  return (
    <VendorCreditDetailDrawerProvider vendorCreditId={vendorCreditId}>
      <DrawerBody>
        <VendorCreditDetail />
      </DrawerBody>
    </VendorCreditDetailDrawerProvider>
  );
}
