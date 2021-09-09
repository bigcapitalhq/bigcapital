import React from 'react';

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
      <VendorDetails />
    </VendorDetailsDrawerProvider>
  );
}
