// @ts-nocheck
import React, { useState, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useCustomer,
  useCurrencies,
  useCreateCustomer,
  useEditCustomer,
  useContact,
  useBranches,
} from '@/hooks/query';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

const CustomerFormContext = createContext();

function CustomerFormProvider({ query, customerId, ...props }) {
  const { state } = useLocation();
  const contactId = state?.action;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch customer details.
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId,
    { enabled: !!customerId },
  );
  // Handle fetch contact duplicate details.
  const { data: contactDuplicate, isLoading: isContactLoading } = useContact(
    contactId,
    { enabled: !!contactId },
  );
  // Handle fetch Currencies data table
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  const { mutateAsync: editCustomerMutate } = useEditCustomer();
  const { mutateAsync: createCustomerMutate } = useCreateCustomer();

  // determines whether the form new or duplicate mode.
  const isNewMode = contactId || !customerId;

  const isFormLoading =
    isCustomerLoading || isCurrenciesLoading || isBranchesLoading;

  const provider = {
    customerId,
    customer,
    currencies,
    branches,
    contactDuplicate,
    submitPayload,
    isNewMode,

    isCustomerLoading,
    isCurrenciesLoading,
    isBranchesSuccess,
    isFormLoading,

    setSubmitPayload,
    editCustomerMutate,
    createCustomerMutate,
  };

  return <CustomerFormContext.Provider value={provider} {...props} />;
}

const useCustomerFormContext = () => React.useContext(CustomerFormContext);

export { CustomerFormProvider, useCustomerFormContext };
