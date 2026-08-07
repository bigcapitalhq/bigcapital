import React, { createContext, useState } from 'react';
import type {
  Bill,
  CreateBillBody,
  EditBillBody,
  Vendor,
  Item,
  AccountsList,
  WarehousesListResponse,
  BranchesListResponse,
  TaxRatesListResponse,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useAccounts,
  useVendors,
  useItems,
  useBill,
  useWarehouses,
  useBranches,
  useSettings,
  useCreateBill,
  useEditBill,
} from '@/hooks/query';
import { useTaxRates } from '@/hooks/query/tax-rates';
import { useFeatureCan } from '@/hooks/state';

type BillFormSubmitPayload = {
  redirect?: boolean;
  status?: boolean;
  resetForm?: boolean;
};
type BillFormContextValue = {
  accounts: AccountsList | undefined;
  vendors: Vendor[];
  items: Item[];
  bill: Bill | undefined;
  warehouses: WarehousesListResponse;
  branches: BranchesListResponse;
  projects: unknown[];
  taxRates: TaxRatesListResponse | undefined;
  submitPayload: BillFormSubmitPayload;
  isNewMode: boolean;

  isSettingLoading: boolean;
  isBillLoading: boolean;
  isAccountsLoading: boolean;
  isItemsLoading: boolean;
  isVendorsLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesLoading: boolean;
  isWarehousesLoading: boolean;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;
  isTaxRatesLoading: boolean;

  createBillMutate: (values: CreateBillBody) => Promise<void>;
  editBillMutate: (args: [number, EditBillBody]) => Promise<void>;
  setSubmitPayload: React.Dispatch<React.SetStateAction<BillFormSubmitPayload>>;
};

const BillFormContext = createContext<BillFormContextValue | undefined>(
  undefined,
);

// Filter all purchasable items only.
const stringifiedFilterRoles = JSON.stringify([
  {
    index: 1,
    fieldKey: 'purchasable',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
  {
    index: 2,
    fieldKey: 'active',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
]);

type BillFormProviderProps = {
  billId?: number;
  children?: React.ReactNode;
};

/**
 * Bill form provider.
 */
function BillFormProvider({ billId, ...props }: BillFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Handle fetch accounts.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch vendors data table
  const { data: vendorsData, isLoading: isVendorsLoading } = useVendors({
    page_size: 10000,
  });
  // Handle fetch Items data table or list
  const { data: itemsData, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });
  // Handle fetch bill details.
  const { data: bill, isLoading: isBillLoading } = useBill(billId, {
    enabled: !!billId,
  });

  // Fetch warehouses list.
  const {
    data: warehouses,
    isLoading: isWarehousesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Fetch tax rates.
  const { data: taxRates, isLoading: isTaxRatesLoading } = useTaxRates();

  // Fetches the projects list.
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(
    {},
    { enabled: !!isProjectsFeatureCan },
  );

  // Handle fetching bill settings.
  const { isFetching: isSettingLoading } = useSettings();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState<BillFormSubmitPayload>({});

  // Create and edit bills mutations.
  const { mutateAsync: createBillMutate } = useCreateBill();
  const { mutateAsync: editBillMutate } = useEditBill();

  const isNewMode = !billId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading =
    isWarehousesLoading ||
    isBranchesLoading ||
    isProjectsLoading ||
    isTaxRatesLoading;

  const provider: BillFormContextValue = {
    accounts: accounts ?? [],
    vendors: vendorsData?.data ?? [],
    items: itemsData?.data ?? [],
    bill,
    warehouses: warehouses ?? [],
    branches: branches ?? [],
    projects: projectsData?.projects ?? [],
    taxRates: taxRates ?? [],
    submitPayload,
    isNewMode,

    isSettingLoading,
    isBillLoading,
    isAccountsLoading,
    isItemsLoading,
    isVendorsLoading,
    isFeatureLoading,
    isBranchesLoading,
    isWarehousesLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    isTaxRatesLoading,

    createBillMutate,
    editBillMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={
        isVendorsLoading || isItemsLoading || isAccountsLoading || isBillLoading
      }
      name={'bill-form'}
    >
      <BillFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBillFormContext = (): BillFormContextValue => {
  const ctx = React.useContext(BillFormContext);
  if (!ctx) {
    throw new Error(
      'useBillFormContext must be used within a BillFormProvider',
    );
  }
  return ctx;
};

export { BillFormProvider, useBillFormContext };
