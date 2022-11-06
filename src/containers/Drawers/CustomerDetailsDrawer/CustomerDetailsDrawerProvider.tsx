// @ts-nocheck
import React from 'react';
import { useCustomer } from '@/hooks/query';
import { DrawerHeaderContent, DrawerLoading } from '@/components';

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
        name="customer-detail-drawer"
        title={customer?.display_name}
      />
      <ContactDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCustomerDetailsDrawerContext = () =>
  React.useContext(ContactDetailDrawerContext);

export { CustomerDetailsDrawerProvider, useCustomerDetailsDrawerContext };
