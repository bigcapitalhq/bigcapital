// @ts-nocheck
import React from 'react';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { useVendor } from '@/hooks/query';
import { DRAWERS } from '@/constants/drawers';

const VendorDetailDrawerContext = React.createContext();

/**
 * Contact detail provider.
 */
function VendorDetailsDrawerProvider({ vendorId, ...props }) {
  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });
  // Provider.
  const provider = {
    vendor,
    vendorId,
    isVendorLoading,
  };

  return (
    <DrawerLoading loading={isVendorLoading}>
      <DrawerHeaderContent
        name={DRAWERS.VENDOR_DETAILS}
        title={vendor?.display_name}
      />
      <VendorDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useVendorDetailsDrawerContext = () =>
  React.useContext(VendorDetailDrawerContext);

export { VendorDetailsDrawerProvider, useVendorDetailsDrawerContext };
