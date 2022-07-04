import React from 'react';

import { DrawerBody } from '@/components';
import VendorDetails from './VendorDetails';
import { VendorDetailsDrawerProvider } from './VendorDetailsDrawerProvider';

/**
 * Contact detail drawer content.
 */
export default function VendorDetailsDrawerContent({
  // #ownProp
  vendorId,
}) {
  return (
    <VendorDetailsDrawerProvider vendorId={vendorId}>
      <DrawerBody>
        <VendorDetails />
      </DrawerBody>
    </VendorDetailsDrawerProvider>
  );
}
