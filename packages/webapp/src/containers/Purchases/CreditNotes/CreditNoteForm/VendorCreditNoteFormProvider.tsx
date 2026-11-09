import { isEmpty, pick } from 'lodash';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { transformToEditForm, type VendorCreditFormValues } from './utils';
import type {
  VendorCredit,
  CreateVendorCreditBody,
  EditVendorCreditBody,
  Item,
  Vendor,
  Warehouse,
  Branch,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { Features } from '@/constants';
import {
  useCreateVendorCredit,
  useEditVendorCredit,
  useVendorCredit,
  useWarehouses,
  useBranches,
  useItems,
  useVendors,
  useSettingsVendorCredits,
  useBill,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type VendorCreditFormSubmitPayload = {
  redirect?: boolean;
  open?: boolean;
  resetForm?: boolean;
};

type VendorCreditFormContextValue = {
  vendorCredit: VendorCredit | undefined;
  items: Item[];
  vendors: Vendor[];
  branches: Branch[];
  warehouses: Warehouse[];
  newVendorCredit: VendorCreditFormValues | [];
  submitPayload: VendorCreditFormSubmitPayload | undefined;
  isNewMode: boolean;

  isVendorCreditLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesLoading: boolean;
  isWarehouesLoading: boolean;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;

  vendorCreditSettings: import('@bigcapital/sdk-ts').SettingsGroup | undefined;

  createVendorCreditMutate: (values: CreateVendorCreditBody) => Promise<void>;
  editVendorCreditMutate: (
    args: [number, EditVendorCreditBody],
  ) => Promise<void>;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<VendorCreditFormSubmitPayload | undefined>
  >;
};

const VendorCreditNoteFormContext = React.createContext<
  VendorCreditFormContextValue | undefined
>(undefined);

type VendorCreditNoteFormProviderProps = {
  vendorCreditId?: number;
  children?: React.ReactNode;
};

/**
 * Vendor Credit note data provider.
 */
function VendorCreditNoteFormProvider({
  vendorCreditId,
  ...props
}: VendorCreditNoteFormProviderProps) {
  const { state } = useLocation();
  const billId = (state as { billId?: number } | null)?.billId;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Handle fetching the items table based on the given query.
  const { data: itemsData, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
  });

  // Handle fetching settings.
  const { data: vendorCreditSettings } = useSettingsVendorCredits();

  // Handle fetch vendors data table or list.
  const { data: vendorsData, isLoading: isVendorsLoading } = useVendors({
    page_size: 10000,
  });

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } =
    useVendorCredit(vendorCreditId, {
      enabled: !!vendorCreditId,
    });

  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // Fetch warehouses list.
  const {
    data: warehouses,
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState<
    VendorCreditFormSubmitPayload | undefined
  >();

  // Create and edit vendor credit mutations.
  const { mutateAsync: createVendorCreditMutate } = useCreateVendorCredit();
  const { mutateAsync: editVendorCreditMutate } = useEditVendorCredit();

  // Determines whether the form is in new mode.
  const isNewMode = !vendorCreditId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const newVendorCredit = !isEmpty(bill)
    ? transformToEditForm({
        ...pick(bill, ['vendorId', 'currencyCode', 'entries']),
      })
    : ([] as []);

  // Provider payload.
  const provider: VendorCreditFormContextValue = {
    vendorCredit,
    items: itemsData?.data ?? [],
    vendors: vendorsData?.data ?? [],
    branches: branches ?? [],
    warehouses: warehouses ?? [],
    newVendorCredit,
    submitPayload,
    isNewMode,

    isVendorCreditLoading,
    isFeatureLoading,
    isBranchesLoading,
    isWarehouesLoading,
    isBranchesSuccess,
    isWarehousesSuccess,

    vendorCreditSettings,

    createVendorCreditMutate,
    editVendorCreditMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={
        isVendorCreditLoading ||
        isItemsLoading ||
        isVendorsLoading ||
        isVendorCreditLoading ||
        isBillLoading
      }
      name={'vendor-credit-form'}
    >
      <VendorCreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorCreditNoteFormContext = (): VendorCreditFormContextValue => {
  const ctx = React.useContext(VendorCreditNoteFormContext);
  if (!ctx) {
    throw new Error(
      'useVendorCreditNoteFormContext must be used within a VendorCreditNoteFormProvider',
    );
  }
  return ctx;
};

export { VendorCreditNoteFormProvider, useVendorCreditNoteFormContext };
