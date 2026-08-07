import React, { createContext, useContext, useState } from 'react';
import type {
  PaymentReceiveEditPageResponse,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useSettingsPaymentReceives,
  usePaymentReceiveEditPage,
  useAccounts,
  useCustomers,
  useBranches,
  useCreatePaymentReceive,
  useEditPaymentReceive,
  usePaymentReceivedState,
} from '@/hooks/query';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useFeatureCan } from '@/hooks/state';

type UseAccountsResult = ReturnType<typeof useAccounts>;
type UseBranchesResult = ReturnType<typeof useBranches>;
type UseCustomersResult = ReturnType<typeof useCustomers>;
type UseProjectsResult = ReturnType<typeof useProjects>;
type UseGetPdfTemplatesResult = ReturnType<typeof useGetPdfTemplates>;
type UseCreatePaymentReceiveResult = ReturnType<typeof useCreatePaymentReceive>;
type UseEditPaymentReceiveResult = ReturnType<typeof useEditPaymentReceive>;
type UsePaymentReceivedStateResult = ReturnType<typeof usePaymentReceivedState>;

type PaymentReceiveSubmitPayload = {
  redirect?: boolean;
  resetForm?: boolean;
  publish?: boolean;
};

type PaymentReceiveEditPageData =
  | PaymentReceiveEditPageResponse['data']
  | undefined;
type PaymentReceiveEditPageEntries =
  | PaymentReceiveEditPageResponse['entries']
  | undefined;

interface PaymentReceiveFormContextValue {
  paymentReceiveId?: number;
  paymentReceiveEditPage: PaymentReceiveEditPageData;
  paymentEntriesEditPage: PaymentReceiveEditPageEntries extends Array<infer T>
    ? T[]
    : PaymentReceiveEditPageEntries;
  accounts: UseAccountsResult['data'];
  customers: NonNullable<UseCustomersResult['data']>['data'];
  branches: UseBranchesResult['data'];
  projects: NonNullable<NonNullable<UseProjectsResult['data']>['projects']>;

  isPaymentLoading: boolean;
  isAccountsLoading: boolean;
  isPaymentFetching: boolean;
  isCustomersLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesLoading: boolean;
  isBranchesSuccess: boolean;
  isNewMode: boolean;

  submitPayload: PaymentReceiveSubmitPayload;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<PaymentReceiveSubmitPayload>
  >;

  editPaymentReceiveMutate: UseEditPaymentReceiveResult['mutateAsync'];
  createPaymentReceiveMutate: UseCreatePaymentReceiveResult['mutateAsync'];

  isExcessConfirmed: boolean;
  setIsExcessConfirmed: React.Dispatch<React.SetStateAction<boolean>>;

  brandingTemplates: UseGetPdfTemplatesResult['data'];
  isBrandingTemplatesLoading: boolean;

  isPaymentReceivedStateLoading: boolean;
  paymentReceivedState: UsePaymentReceivedStateResult['data'];

  paymentReceiveSettings: SettingsGroup | undefined;
  isBootLoading: boolean;
}

type PaymentReceiveFormProviderProps = {
  query?: Record<string, unknown>;
  paymentReceiveId?: number;
  children?: React.ReactNode;
};

const PaymentReceiveFormContext = createContext<
  PaymentReceiveFormContextValue | undefined
>(undefined);

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({
  query,
  paymentReceiveId,
  ...props
}: PaymentReceiveFormProviderProps) {
  const [submitPayload, setSubmitPayload] =
    React.useState<PaymentReceiveSubmitPayload>({});

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Fetches payment recevie details.
  const {
    data: paymentReceivedEditData,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceiveEditPage(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });
  const paymentReceiveEditPage = paymentReceivedEditData?.data;
  const paymentEntriesEditPage = paymentReceivedEditData?.entries;

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch payment made settings.
  const { data: paymentReceiveSettings } = useSettingsPaymentReceives();

  // Fetches customers list.
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page_size: 10000,
  });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetches the projects list.
  const { data: projectsData } = useProjects(
    {},
    { enabled: !!isProjectsFeatureCan },
  );

  // Fetches branding templates of payment received module.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'PaymentReceive' });

  // Fetches the payment received initial state.
  const {
    data: paymentReceivedState,
    isLoading: isPaymentReceivedStateLoading,
  } = usePaymentReceivedState();

  const isNewMode = !paymentReceiveId;

  const isFeatureLoading = isBranchesLoading;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  const [isExcessConfirmed, setIsExcessConfirmed] = useState<boolean>(false);

  const isBootLoading =
    isPaymentLoading ||
    isAccountsLoading ||
    isCustomersLoading ||
    isBrandingTemplatesLoading ||
    isPaymentReceivedStateLoading;

  const provider: PaymentReceiveFormContextValue = {
    paymentReceiveId,
    paymentReceiveEditPage,
    paymentEntriesEditPage: paymentEntriesEditPage ?? [],
    accounts: accounts ?? [],
    customers: customersData?.data ?? [],
    branches: branches ?? [],
    projects: projectsData?.projects ?? [],

    isPaymentLoading,
    isAccountsLoading,
    isPaymentFetching,
    isCustomersLoading,
    isFeatureLoading,
    isBranchesLoading,
    isBranchesSuccess,
    isNewMode,

    submitPayload,
    setSubmitPayload,

    editPaymentReceiveMutate,
    createPaymentReceiveMutate,

    isExcessConfirmed,
    setIsExcessConfirmed,

    brandingTemplates,
    isBrandingTemplatesLoading,

    isPaymentReceivedStateLoading,
    paymentReceivedState,

    paymentReceiveSettings,

    isBootLoading,
  };

  return <PaymentReceiveFormContext.Provider value={provider} {...props} />;
}

const usePaymentReceiveFormContext = (): PaymentReceiveFormContextValue => {
  const ctx = useContext(PaymentReceiveFormContext);
  if (!ctx) {
    throw new Error(
      'usePaymentReceiveFormContext must be used within a PaymentReceiveFormProvider',
    );
  }
  return ctx;
};

export { PaymentReceiveFormProvider, usePaymentReceiveFormContext };
