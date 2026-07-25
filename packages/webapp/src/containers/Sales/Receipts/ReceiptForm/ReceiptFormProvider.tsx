import React, { createContext, useState } from 'react';
import type {
  SaleReceipt,
  CreateSaleReceiptBody,
  EditSaleReceiptBody,
  SaleReceiptStateResponse,
  Account,
  Customer,
  Item,
  Warehouse,
  Branch,
  PdfTemplateResponse,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useReceipt,
  useAccounts,
  useSettingsReceipts,
  useCustomers,
  useWarehouses,
  useBranches,
  useItems,
  useCreateReceipt,
  useEditReceipt,
  useGetReceiptState,
} from '@/hooks/query';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useFeatureCan } from '@/hooks/state';

type ReceiptFormSubmitPayload = {
  redirect?: boolean;
  status?: boolean;
  resetForm?: boolean;
};

type ReceiptFormContextValue = {
  receiptId: number | undefined;
  receipt: SaleReceipt | undefined;
  accounts: Account[];
  customers: Customer[];
  items: Item[];
  branches: Branch[];
  warehouses: Warehouse[];
  projects: unknown[];
  submitPayload: ReceiptFormSubmitPayload | undefined;

  isNewMode: boolean;
  isReceiptLoading: boolean;
  isAccountsLoading: boolean;
  isCustomersLoading: boolean;
  isItemsLoading: boolean;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
  isFeatureLoading: boolean;
  isSettingLoading: boolean;
  receiptSettings: import('@bigcapital/sdk-ts').SettingsGroup | undefined;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;

  createReceiptMutate: (values: CreateSaleReceiptBody) => Promise<unknown>;
  editReceiptMutate: (args: [number, EditSaleReceiptBody]) => Promise<unknown>;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<ReceiptFormSubmitPayload | undefined>
  >;

  // Branding templates
  brandingTemplates: PdfTemplateResponse[];
  isBrandingTemplatesLoading: boolean;

  // State
  isSaleReceiptStateLoading: boolean;
  saleReceiptState: SaleReceiptStateResponse | undefined;

  isBootLoading: boolean;
};

type ReceiptFormProviderProps = {
  receiptId?: number;
  children?: React.ReactNode;
};

const ReceiptFormContext = createContext<ReceiptFormContextValue | undefined>(
  undefined,
);

/**
 * Receipt form provider.
 */
function ReceiptFormProvider({
  receiptId,
  ...props
}: ReceiptFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Fetch sale receipt details.
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(receiptId, {
    enabled: !!receiptId,
  });
  // Fetch accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch customers list.
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page_size: 10000,
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

  // Filter all sellable items only.
  const stringifiedFilterRoles = React.useMemo(
    () =>
      JSON.stringify([
        {
          index: 1,
          fieldKey: 'sellable',
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
      ]),
    [],
  );

  // Handle fetch Items data table or list.
  const { data: itemsData, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });
  // Fetch project list.
  const { data: projectsData } = useProjects(
    {},
    { enabled: !!isProjectsFeatureCan },
  );

  // Fetches branding templates of receipt.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'SaleReceipt' });

  // Fetches the sale receipt state.
  const { data: saleReceiptState, isLoading: isSaleReceiptStateLoading } =
    useGetReceiptState();

  // Fetch receipt settings.
  const { data: receiptSettings, isLoading: isSettingLoading } =
    useSettingsReceipts();

  const { mutateAsync: createReceiptMutate } = useCreateReceipt();
  const { mutateAsync: editReceiptMutate } = useEditReceipt();

  const [submitPayload, setSubmitPayload] = useState<
    ReceiptFormSubmitPayload | undefined
  >();

  const isNewMode = !receiptId;
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const isBootLoading =
    isReceiptLoading ||
    isAccountsLoading ||
    isCustomersLoading ||
    isItemsLoading ||
    isSettingLoading ||
    isBrandingTemplatesLoading ||
    isSaleReceiptStateLoading;

  const provider: ReceiptFormContextValue = {
    receiptId,
    receipt,
    accounts: accounts ?? [],
    customers: customersData?.data ?? [],
    items: itemsData?.data ?? [],
    branches: branches ?? [],
    warehouses: warehouses ?? [],
    projects: projectsData?.projects ?? [],
    submitPayload,

    isNewMode,
    isReceiptLoading,
    isAccountsLoading,
    isCustomersLoading,
    isItemsLoading,
    isWarehouesLoading,
    isBranchesLoading,
    isFeatureLoading,
    isSettingLoading,
    receiptSettings,
    isBranchesSuccess,
    isWarehousesSuccess,

    createReceiptMutate,
    editReceiptMutate,
    setSubmitPayload,

    // Branding templates
    brandingTemplates: brandingTemplates?.templates ?? [],
    isBrandingTemplatesLoading,

    // State
    isSaleReceiptStateLoading,
    saleReceiptState,

    isBootLoading,
  };
  return <ReceiptFormContext.Provider value={provider} {...props} />;
}

const useReceiptFormContext = (): ReceiptFormContextValue => {
  const ctx = React.useContext(ReceiptFormContext);
  if (ctx === undefined) {
    throw new Error(
      'useReceiptFormContext must be used within a ReceiptFormProvider',
    );
  }
  return ctx;
};

export { ReceiptFormProvider, useReceiptFormContext };
