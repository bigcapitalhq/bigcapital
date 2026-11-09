import React from 'react';
import { VendorDetails } from './VendorDetails';
import { VendorDetailsDrawerProvider } from './VendorDetailsDrawerProvider';
import { DrawerBody } from '@/components';

interface VendorDetailsDrawerContentProps {
  vendorId: number | undefined;
}

/**
 * Contact detail drawer content.
 */
export function VendorDetailsDrawerContent({
  vendorId,
}: VendorDetailsDrawerContentProps) {
  return (
    <VendorDetailsDrawerProvider vendorId={vendorId}>
      <DrawerBody>
        <VendorDetails />
      </DrawerBody>
    </VendorDetailsDrawerProvider>
  );
}
