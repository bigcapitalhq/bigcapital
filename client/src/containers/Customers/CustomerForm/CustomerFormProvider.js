import React, { useState, createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useCustomers,
  useCustomer,
  useCurrencies,
  useCreateCustomer,
  useEditCustomer,
} from 'hooks/query';

const CustomerFormContext = createContext();

function CustomerFormProvider({ customerId, ...props }) {
  // Handle fetch customer details.
  const { data: customer, isFetching: isCustomerLoading } = useCustomer(
    customerId,
    {
        enabled: !!customerId,
    }
  );

  // Handle fetch customers data table
  const {
    data: { customers },
    isFetching: isCustomersLoading,
  } = useCustomers();

  // Handle fetch Currencies data table
  const { data: currencies, isFetching: isCurrenciesLoading } = useCurrencies();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  const { mutateAsync: editCustomerMutate } = useEditCustomer();
  const { mutateAsync: createCustomerMutate } = useCreateCustomer();

  const provider = {
    customerId,
    customer,
    customers,
    currencies,
    submitPayload,

    isCustomerLoading,
    isCustomersLoading,
    isCurrenciesLoading,

    setSubmitPayload,
    editCustomerMutate,
    createCustomerMutate
  };

  return (
    <DashboardInsider
      loading={isCustomerLoading || isCustomerLoading || isCurrenciesLoading}
      name={'customer-form'}
    >
      <CustomerFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCustomerFormContext = () => React.useContext(CustomerFormContext);

export { CustomerFormProvider, useCustomerFormContext };
