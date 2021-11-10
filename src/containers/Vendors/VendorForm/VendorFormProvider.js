import React, { useState, createContext } from 'react';
import { omit, pick } from 'lodash';
import { useLocation } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useVendor,
  useContact,
  useCurrencies,
  useCreateVendor,
  useEditVendor,
} from 'hooks/query';

const VendorFormContext = createContext();

/**
 * Vendor form provider.
 */
function VendorFormProvider({ vendorId, ...props }) {
  const { state } = useLocation();

  const contactId = state?.action;

  // Handle fetch Currencies data table
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  // Handle fetch contact duplicate details.
  const { data: contactDuplicate, isLoading: isContactLoading } = useContact(
    contactId,
    { enabled: !!contactId },
  );
  // Create and edit vendor mutations.
  const { mutateAsync: createVendorMutate } = useCreateVendor();
  const { mutateAsync: editVendorMutate } = useEditVendor();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // determines whether the form new or duplicate mode.
  const isNewMode = contactId || !vendorId;

  const isFormLoading =
    isVendorLoading || isContactLoading || isCurrenciesLoading;

  const provider = {
    vendorId,
    currencies,
    vendor,
    contactDuplicate: { ...omit(contactDuplicate, ['opening_balance_at']) },
    submitPayload,

    isNewMode,
    isFormLoading,

    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
  };

  return <VendorFormContext.Provider value={provider} {...props} />;
}

const useVendorFormContext = () => React.useContext(VendorFormContext);

export { VendorFormProvider, useVendorFormContext };
