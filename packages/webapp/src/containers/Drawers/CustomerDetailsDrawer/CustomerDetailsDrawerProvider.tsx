import React from 'react';
import type { Customer } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useCustomer } from '@/hooks/query';

/**
 * The SDK `Customer` type is missing several backend-supplied display fields
 * (formatted_balance, formatted_opening_balance, formatted_opening_balance_at,
 * formatted_customer_type). These are rendered in the drawer header/details,
 * so we model them as optional extras on top of the SDK shape.
 */
export type CustomerDetails = Customer & {
  formattedBalance?: string;
  formattedOpeningBalance?: string;
  formattedOpeningBalanceAt?: string;
  formattedCustomerType?: string;
};

export interface CustomerDetailsDrawerContextValue {
  customer: CustomerDetails | undefined;
  customerId: number | undefined;
  contact: CustomerDetails | undefined;
  isCustomerLoading: boolean;
}

interface CustomerDetailsDrawerProviderProps {
  customerId: number | undefined;
  children?: React.ReactNode;
}

const ContactDetailDrawerContext = React.createContext<
  CustomerDetailsDrawerContextValue | undefined
>(undefined);

/**
 * Contact detail provider.
 */
function CustomerDetailsDrawerProvider({
  customerId,
  children,
}: CustomerDetailsDrawerProviderProps) {
  // Handle fetch customer details.
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId,
    {
      enabled: !!customerId,
    },
  );

  // The query returns the SDK `Customer`, but the backend response also
  // includes several `formatted_*` display fields that aren't modelled in
  // the SDK type. Treat the payload as the wider `CustomerDetails` shape.
  const customerDetails = customer as CustomerDetails | undefined;

  // Provider.
  const provider: CustomerDetailsDrawerContextValue = {
    customer: customerDetails,
    // Backwards-compat alias used by some consumers.
    contact: customerDetails,
    customerId,
    isCustomerLoading,
  };

  return (
    <DrawerLoading loading={isCustomerLoading}>
      <DrawerHeaderContent
        name={DRAWERS.CUSTOMER_DETAILS}
        title={customer?.displayName}
      />
      <ContactDetailDrawerContext.Provider value={provider}>
        {children}
      </ContactDetailDrawerContext.Provider>
    </DrawerLoading>
  );
}

const useCustomerDetailsDrawerContext =
  (): CustomerDetailsDrawerContextValue => {
    const ctx = React.useContext(ContactDetailDrawerContext);
    if (!ctx) {
      throw new Error(
        'useCustomerDetailsDrawerContext must be used within CustomerDetailsDrawerProvider',
      );
    }
    return ctx;
  };

export { CustomerDetailsDrawerProvider, useCustomerDetailsDrawerContext };
