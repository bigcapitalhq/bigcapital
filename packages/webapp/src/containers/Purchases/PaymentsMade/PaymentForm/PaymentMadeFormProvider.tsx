import React, { createContext, useContext, useState } from 'react';
import type { BillPaymentEditPageResponse } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useVendors,
  useItems,
  useBranches,
  usePaymentMadeEditPage,
  useSettingsBillPayments,
  useCreatePaymentMade,
  useEditPaymentMade,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseAccountsResult = ReturnType<typeof useAccounts>;
type UseVendorsResult = ReturnType<typeof useVendors>;
type UseItemsResult = ReturnType<typeof useItems>;
type UseBranchesResult = ReturnType<typeof useBranches>;
type UseCreatePaymentMadeResult = ReturnType<typeof useCreatePaymentMade>;
type UseEditPaymentMadeResult = ReturnType<typeof useEditPaymentMade>;

type PaymentMadeEditPageData =
  | BillPaymentEditPageResponse['billPayment']
  | undefined;
type PaymentMadeEditPageEntries =
  | BillPaymentEditPageResponse['entries']
  | undefined;

type PaymentMadeSubmitPayload = {
  redirect?: boolean;
  resetForm?: boolean;
  publish?: boolean;
};

interface PaymentMadeFormContextValue {
  paymentMadeId?: number;
  paymentMadeEditPage: PaymentMadeEditPageData;
  paymentEntriesEditPage: PaymentMadeEditPageEntries;

  accounts: UseAccountsResult['data'];
  vendors: NonNullable<UseVendorsResult['data']>['data'];
  items: NonNullable<UseItemsResult['data']>['data'];
  branches: UseBranchesResult['data'];

  paymentVendorId: number | null;
  setPaymentVendorId: React.Dispatch<React.SetStateAction<number | null>>;

  isNewMode: boolean;
  isAccountsLoading: boolean;
  isItemsFetching: boolean;
  isItemsLoading: boolean;
  isVendorsLoading: boolean;
  isPaymentFetching: boolean;
  isPaymentLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesLoading: boolean;
  isBranchesSuccess: boolean;

  submitPayload: PaymentMadeSubmitPayload;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<PaymentMadeSubmitPayload>
  >;

  createPaymentMadeMutate: UseCreatePaymentMadeResult['mutateAsync'];
  editPaymentMadeMutate: UseEditPaymentMadeResult['mutateAsync'];

  isExcessConfirmed: boolean;
  setIsExcessConfirmed: React.Dispatch<React.SetStateAction<boolean>>;

  billPaymentSettings: import('@bigcapital/sdk-ts').SettingsGroup | undefined;
}

type PaymentMadeFormProviderProps = {
  query?: Record<string, unknown>;
  paymentMadeId?: number;
  children?: React.ReactNode;
};

const PaymentMadeFormContext = createContext<
  PaymentMadeFormContextValue | undefined
>(undefined);

/**
 * Payment made form provider.
 */
function PaymentMadeFormProvider({
  query,
  paymentMadeId,
  ...props
}: PaymentMadeFormProviderProps) {
  const [submitPayload, setSubmitPayload] =
    React.useState<PaymentMadeSubmitPayload>({});
  const [paymentVendorId, setPaymentVendorId] = React.useState<number | null>(
    null,
  );

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch Items data table or list.
  const {
    data: itemsData,
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({ page_size: 10000 });

  // Handle fetch venders data table or list.
  const { data: vendorsData, isLoading: isVendorsLoading } = useVendors({
    page_size: 10000,
  });

  // Handle fetch specific payment made details.
  const {
    data: paymentMadeEditData,
    isFetching: isPaymentFetching,
    isLoading: isPaymentLoading,
  } = usePaymentMadeEditPage(paymentMadeId, {
    enabled: !!paymentMadeId,
  });
  const paymentMadeEditPage = paymentMadeEditData?.billPayment;
  const paymentEntriesEditPage = paymentMadeEditData?.entries;

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetch payment made settings.
  const { data: billPaymentSettings } = useSettingsBillPayments();

  // Create and edit payment made mutations.
  const { mutateAsync: createPaymentMadeMutate } = useCreatePaymentMade();
  const { mutateAsync: editPaymentMadeMutate } = useEditPaymentMade();

  const isNewMode = !paymentMadeId;

  const isFeatureLoading = isBranchesLoading;

  const [isExcessConfirmed, setIsExcessConfirmed] = useState<boolean>(false);

  const provider: PaymentMadeFormContextValue = {
    paymentMadeId,
    accounts: accounts ?? [],
    paymentEntriesEditPage,
    paymentMadeEditPage,
    vendors: vendorsData?.data ?? [],
    items: itemsData?.data ?? [],
    branches: branches ?? [],
    submitPayload,
    paymentVendorId,

    isNewMode,
    isAccountsLoading,
    isItemsFetching,
    isItemsLoading,
    isVendorsLoading,
    isPaymentFetching,
    isPaymentLoading,
    isFeatureLoading,
    isBranchesLoading,
    isBranchesSuccess,

    createPaymentMadeMutate,
    editPaymentMadeMutate,

    setSubmitPayload,
    setPaymentVendorId,

    isExcessConfirmed,
    setIsExcessConfirmed,

    billPaymentSettings,
  };

  return (
    <DashboardInsider
      loading={
        isVendorsLoading ||
        isItemsLoading ||
        isAccountsLoading ||
        isPaymentLoading
      }
      name={'payment-made'}
    >
      <PaymentMadeFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadeFormContext = (): PaymentMadeFormContextValue => {
  const ctx = useContext(PaymentMadeFormContext);
  if (!ctx) {
    throw new Error(
      'usePaymentMadeFormContext must be used within a PaymentMadeFormProvider',
    );
  }
  return ctx;
};

export { PaymentMadeFormProvider, usePaymentMadeFormContext };
