import React from 'react';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useVendor } from 'hooks/query';

const VendorDetailDrawerContext = React.createContext();

/**
 * Contact detail provider.
 */
function VendorDetailsDrawerProvider({ vendorId, ...props }) {
  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(
    vendorId,
    {
      enabled: !!vendorId,
    },
  );
  // Provider.
  const provider = {
    vendor,
    vendorId,
    isVendorLoading,
  };

  return (
    <DashboardInsider loading={isVendorLoading}>
      <DrawerHeaderContent
        name="vendor-details-drawer"
        title={vendor?.display_name}
      />
      <VendorDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorDetailsDrawerContext = () =>
  React.useContext(VendorDetailDrawerContext);

export { VendorDetailsDrawerProvider, useVendorDetailsDrawerContext };
