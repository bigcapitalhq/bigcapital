import React from 'react';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { useCustomer } from 'hooks/query';

const ContactDetailDrawerContext = React.createContext();

/**
 * Contact detail provider.
 */
function CustomerDetailsDrawerProvider({ customerId, ...props }) {
  // Handle fetch customer details.
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId,
    {
      enabled: !!customerId,
    },
  );
  // Provider.
  const provider = {
    customer,
    customerId,
    isCustomerLoading,
  };

  return (
    <DrawerLoading loading={isCustomerLoading}>
      <DrawerHeaderContent
        name="customer-details-drawer"
        title={customer?.display_name}
      />
      <ContactDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCustomerDetailsDrawerContext = () =>
  React.useContext(ContactDetailDrawerContext);

export { CustomerDetailsDrawerProvider, useCustomerDetailsDrawerContext };
