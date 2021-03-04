import React, { useState, createContext } from 'react';
import { omit, pick } from 'lodash';
import { useLocation } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useVendor,
  useContact,
  useCurrencies,
  useCustomer,
  useCreateVendor,
  useEditVendor,
} from 'hooks/query';

const VendorFormContext = createContext();

/**
 * Vendor form provider.
 */
function VendorFormProvider({ vendorId, ...props }) {
  const { state } = useLocation();

  // Handle fetch Currencies data table
  const { data: currencies, isFetching: isCurrenciesLoading } = useCurrencies();

  // Handle fetch vendor details.
  const { data: vendor, isFetching: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  const contactId = state?.action;

  // Handle fetch contact duplicate details.
  const { data: contactDuplicate, isFetching: isContactLoading } = useContact(
    contactId,
    {
      enabled: !!contactId,
    },
  );

  // Create and edit vendor mutations.
  const { mutateAsync: createVendorMutate } = useCreateVendor();
  const { mutateAsync: editVendorMutate } = useEditVendor();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  const provider = {
    vendorId,
    currencies,
    vendor,
    contactDuplicate: { ...omit(contactDuplicate, ['opening_balance_at']) },
    submitPayload,

    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isVendorLoading || isContactLoading || isCurrenciesLoading}
      name={'vendor-form'}
    >
      <VendorFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorFormContext = () => React.useContext(VendorFormContext);

export { VendorFormProvider, useVendorFormContext };
