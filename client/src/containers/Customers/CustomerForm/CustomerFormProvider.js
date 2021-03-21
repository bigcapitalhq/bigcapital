import React, { useState, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useCustomer,
  useCurrencies,
  useCreateCustomer,
  useEditCustomer,
  useContact,
} from 'hooks/query';

const CustomerFormContext = createContext();

function CustomerFormProvider({ customerId, ...props }) {
  const { state } = useLocation();

  const contactId = state?.action;

  // Handle fetch customer details.
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId,
    { enabled: !!customerId },
  );
  // Handle fetch contact duplicate details.
  const { data: contactDuplicate, isLoading: isContactLoading } = useContact(
    contactId,
    { enabled: !!contactId, },
  );
  // Handle fetch Currencies data table
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  const { mutateAsync: editCustomerMutate } = useEditCustomer();
  const { mutateAsync: createCustomerMutate } = useCreateCustomer();

  // determines whether the form new or duplicate mode.
  const isNewMode = contactId || !customerId;

  const provider = {
    customerId,
    customer,
    currencies,
    contactDuplicate,
    submitPayload,
    isNewMode,

    isCustomerLoading,
    isCurrenciesLoading,

    setSubmitPayload,
    editCustomerMutate,
    createCustomerMutate,
  };

  return (
    <DashboardInsider
      loading={
        isCustomerLoading ||
        isCustomerLoading ||
        isCurrenciesLoading ||
        isContactLoading
      }
      name={'customer-form'}
    >
      <CustomerFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCustomerFormContext = () => React.useContext(CustomerFormContext);

export { CustomerFormProvider, useCustomerFormContext };
