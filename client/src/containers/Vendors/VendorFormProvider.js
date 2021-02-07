import React, { useState, createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useVendor,
  useVendors,
  useCurrencies,
  useCreateVendor,
  useEditVendor,
} from 'hooks/query';

const VendorFormContext = createContext();

/**
 * Vendor form provider.
 */
function VendorFormProvider({ vendorId, ...props }) {
  // Handle fetch Currencies data table
  const { data: currencies, isFetching: isCurrenciesLoading } = useCurrencies();

  // Handle fetch vendors data table
  const {
    data: { vendors },
    isFetching: isVendorsLoading,
  } = useVendors();

  // Handle fetch vendor details.
  const { data: vendor, isFetching: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // Create and edit vendor mutations.
  const { mutateAsync: createVendorMutate } = useCreateVendor();
  const { mutateAsync: editVendorMutate } = useEditVendor();

  const provider = {
    currencies,
    vendors,
    vendor,
    submitPayload,

    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isVendorLoading || isVendorsLoading || isCurrenciesLoading}
      name={'vendor-form'}
    >
      <VendorFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorFormContext = () => React.useContext(VendorFormContext);

export { VendorFormProvider, useVendorFormContext };
