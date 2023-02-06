// @ts-nocheck
import React from 'react';

import { VendorDetailsDrawerProvider } from './VendorDetailsDrawerProvider';
import { DrawerBody } from '@/components';
import VendorDetails from './VendorDetails';

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
