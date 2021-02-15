import React, { useState, createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useVendor,
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

  // Handle fetch vendor details.
  const { data: vendor, isFetching: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  // Create and edit vendor mutations.
  const { mutateAsync: createVendorMutate } = useCreateVendor();
  const { mutateAsync: editVendorMutate } = useEditVendor();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  const provider = {
    vendorId,
    currencies,
    vendor,
    submitPayload,

    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isVendorLoading || isCurrenciesLoading}
      name={'vendor-form'}
    >
      <VendorFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorFormContext = () => React.useContext(VendorFormContext);

export { VendorFormProvider, useVendorFormContext };
