import { omit } from 'lodash';
import React, { useState, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import type {
  ContactResponse,
  CreateVendorBody,
  CurrenciesListResponse,
  BranchesListResponse,
  EditVendorBody,
  Vendor,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import {
  useVendor,
  useContact,
  useCurrencies,
  useCreateVendor,
  useEditVendor,
  useBranches,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseEditVendorResult = ReturnType<typeof useEditVendor>;
type UseCreateVendorResult = ReturnType<typeof useCreateVendor>;

type VendorFormSubmitPayload = {
  noRedirect?: boolean;
};

type VendorFormContextValue = {
  vendorId?: number;
  vendor?: Vendor | undefined;
  currencies: CurrenciesListResponse;
  branches: BranchesListResponse;
  contactDuplicate: Partial<ContactResponse>;
  submitPayload: VendorFormSubmitPayload;
  isNewMode: boolean;

  isVendorLoading: boolean;
  isCurrenciesLoading: boolean;
  isBranchesSuccess: boolean;
  isFormLoading: boolean;

  setSubmitPayload: React.Dispatch<
    React.SetStateAction<VendorFormSubmitPayload>
  >;

  editVendorMutate: UseEditVendorResult['mutateAsync'];
  createVendorMutate: UseCreateVendorResult['mutateAsync'];
};

type VendorFormProviderProps = {
  query?: Record<string, unknown>;
  vendorId?: number;
  children?: React.ReactNode;
};

const VendorFormContext = createContext<VendorFormContextValue | undefined>(
  undefined,
);

/**
 * Vendor form provider.
 */
function VendorFormProvider({
  query,
  vendorId,
  children,
}: VendorFormProviderProps) {
  const { state } = useLocation<{ action?: number | string }>();
  const contactId =
    typeof state?.action === 'number' ? state.action : undefined;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch Currencies data table
  const { data: currencies, isLoading: isCurrenciesLoading } =
    useCurrencies(undefined);

  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });
  // Handle fetch contact duplicate details.
  const { data: contactDuplicate, isLoading: isContactLoading } = useContact(
    contactId,
    { enabled: !!contactId },
  );

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Create and edit vendor mutations.
  const { mutateAsync: createVendorMutate } = useCreateVendor();
  const { mutateAsync: editVendorMutate } = useEditVendor();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState<VendorFormSubmitPayload>(
    {},
  );

  // determines whether the form new or duplicate mode.
  const isNewMode = Boolean(contactId) || !vendorId;

  const isFormLoading =
    isVendorLoading ||
    isContactLoading ||
    isCurrenciesLoading ||
    isBranchesLoading;

  const provider: VendorFormContextValue = {
    vendorId,
    currencies: currencies ?? [],
    vendor,
    branches: branches ?? [],
    contactDuplicate: contactDuplicate
      ? { ...omit(contactDuplicate, ['opening_balance_at']) }
      : {},
    submitPayload,
    isNewMode,
    isFormLoading,
    isBranchesSuccess,
    isVendorLoading,
    isCurrenciesLoading,

    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
  };

  return (
    <VendorFormContext.Provider value={provider}>
      {children}
    </VendorFormContext.Provider>
  );
}

const useVendorFormContext = () => {
  const ctx = React.useContext(VendorFormContext);
  if (!ctx) {
    throw new Error(
      'useVendorFormContext must be used within a VendorFormProvider',
    );
  }
  return ctx;
};

export { VendorFormProvider, useVendorFormContext };
export type { VendorFormSubmitPayload };
