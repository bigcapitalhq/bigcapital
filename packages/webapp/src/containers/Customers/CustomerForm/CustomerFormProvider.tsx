import {
  CurrenciesListResponse,
  BranchesListResponse,
  ContactResponse,
  Customer,
} from '@bigcapital/sdk-ts';
import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Features } from '@/constants';
import {
  useCustomer,
  useCurrencies,
  useCreateCustomer,
  useEditCustomer,
  useContact,
  useBranches,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseEditCustomerResult = ReturnType<typeof useEditCustomer>;
type UseCreateCustomerResult = ReturnType<typeof useCreateCustomer>;

type CustomerFormSubmitPayload = {
  noRedirect?: boolean;
};

type CustomerFormContextValue = {
  customerId?: number;
  customer?: Customer | undefined;
  currencies: CurrenciesListResponse;
  branches: BranchesListResponse;
  contactDuplicate?: ContactResponse | undefined;
  submitPayload: CustomerFormSubmitPayload;
  isNewMode: boolean;

  isCustomerLoading: boolean;
  isCurrenciesLoading: boolean;
  isBranchesSuccess: boolean;
  isFormLoading: boolean;

  setSubmitPayload: React.Dispatch<
    React.SetStateAction<CustomerFormSubmitPayload>
  >;

  editCustomerMutate: UseEditCustomerResult['mutateAsync'];
  createCustomerMutate: UseCreateCustomerResult['mutateAsync'];
};

type CustomerFormProviderProps = {
  query?: Record<string, unknown>;
  customerId?: number;
  children?: React.ReactNode;
};

const CustomerFormContext = createContext<CustomerFormContextValue | undefined>(
  undefined,
);

export function CustomerFormProvider({
  query,
  customerId,
  children,
}: CustomerFormProviderProps) {
  const { state } = useLocation<{ action?: number | string }>();
  const contactId =
    typeof state?.action === 'number' ? state.action : undefined;

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
  const { data: currencies, isLoading: isCurrenciesLoading } =
    useCurrencies(undefined);

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState<CustomerFormSubmitPayload>(
    {},
  );

  const { mutateAsync: editCustomerMutate } = useEditCustomer();
  const { mutateAsync: createCustomerMutate } = useCreateCustomer();

  // determines whether the form new or duplicate mode.
  const isNewMode = Boolean(contactId) || !customerId;

  const isFormLoading =
    isCustomerLoading || isCurrenciesLoading || isBranchesLoading;

  const provider: CustomerFormContextValue = {
    customerId,
    customer,
    currencies: currencies ?? [],
    branches: branches ?? [],
    contactDuplicate: contactDuplicate || undefined,
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

  return (
    <CustomerFormContext.Provider value={provider}>
      {children}
    </CustomerFormContext.Provider>
  );
}

export const useCustomerFormContext = () => {
  const ctx = React.useContext(CustomerFormContext);
  if (!ctx) {
    throw new Error(
      'useCustomerFormContext must be used within a CustomerFormProvider',
    );
  }
  return ctx;
};
