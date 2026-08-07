import { isEmpty, pick } from 'lodash';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { transformToEditForm, type CreditNoteFormValues } from './utils';
import type {
  CreditNote,
  CreateCreditNoteBody,
  EditCreditNoteBody,
  CreditNoteStateResponse,
  Item,
  Customer,
  Warehouse,
  Branch,
  PdfTemplateResponse,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import {
  useCreditNote,
  useCreateCreditNote,
  useEditCreditNote,
  useItems,
  useCustomers,
  useWarehouses,
  useBranches,
  useSettingsCreditNotes,
  useInvoice,
  useGetCreditNoteState,
} from '@/hooks/query';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useFeatureCan } from '@/hooks/state';

type CreditNoteFormSubmitPayload = {
  redirect?: boolean;
  open?: boolean;
  resetForm?: boolean;
};

type CreditNoteFormContextValue = {
  creditNote: CreditNote | undefined;
  items: Item[];
  customers: Customer[];
  branches: Branch[];
  warehouses: Warehouse[];
  newCreditNote: CreditNoteFormValues | [];
  submitPayload: CreditNoteFormSubmitPayload | undefined;
  brandingTemplates: PdfTemplateResponse[];
  isNewMode: boolean;

  isItemsLoading: boolean;
  isCustomersLoading: boolean;
  isCreditNoteLoading: boolean;
  isInvoiceLoading: boolean;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;
  isBrandingTemplatesLoading: boolean;
  isCreditNoteStateLoading: boolean;
  creditNoteSettings: import('@bigcapital/sdk-ts').SettingsGroup | undefined;
  isBootLoading: boolean;

  createCreditNoteMutate: (values: CreateCreditNoteBody) => Promise<void>;
  editCreditNoteMutate: (args: [number, EditCreditNoteBody]) => Promise<void>;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<CreditNoteFormSubmitPayload | undefined>
  >;

  creditNoteState: CreditNoteStateResponse | undefined;
};

const CreditNoteFormContext = React.createContext<
  CreditNoteFormContextValue | undefined
>(undefined);

type CreditNoteFormProviderProps = {
  creditNoteId?: number;
  children?: React.ReactNode;
};

/**
 * Credit note data provider.
 */
function CreditNoteFormProvider({
  creditNoteId,
  ...props
}: CreditNoteFormProviderProps) {
  const { state } = useLocation();
  const invoiceId = (state as { invoiceId?: number } | null)?.invoiceId;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch customers data table or list
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page_size: 10000,
  });
  // Handle fetching the items table based on the given query.
  const { data: itemsData, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
  });
  // Handle fetch  credit details.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );
  // Handle fetch invoice detail.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId);

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

  // Fetches branding templates of invoice.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'CreditNote' });

  // Fetches the credit note state.
  const { data: creditNoteState, isLoading: isCreditNoteStateLoading } =
    useGetCreditNoteState();

  // Handle fetching settings.
  const { data: creditNoteSettings } = useSettingsCreditNotes();

  // Create and edit credit note mutations.
  const { mutateAsync: createCreditNoteMutate } = useCreateCreditNote();
  const { mutateAsync: editCreditNoteMutate } = useEditCreditNote();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState<
    CreditNoteFormSubmitPayload | undefined
  >();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const newCreditNote = !isEmpty(invoice)
    ? transformToEditForm({
        ...pick(invoice, ['customerId', 'currencyCode', 'entries']),
      })
    : ([] as []);

  const isBootLoading =
    isItemsLoading ||
    isCustomersLoading ||
    isCreditNoteLoading ||
    isInvoiceLoading ||
    isBrandingTemplatesLoading;

  // Provider payload.
  const provider: CreditNoteFormContextValue = {
    creditNote,
    items: itemsData?.data ?? [],
    customers: customersData?.data ?? [],
    branches: branches ?? [],
    warehouses: warehouses ?? [],
    newCreditNote,
    submitPayload,
    brandingTemplates: brandingTemplates?.templates ?? [],
    isNewMode,

    isItemsLoading,
    isCustomersLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    isCreditNoteLoading,
    isInvoiceLoading,
    isWarehouesLoading,
    isBranchesLoading,
    isBrandingTemplatesLoading,
    isCreditNoteStateLoading,
    creditNoteSettings,
    isBootLoading,

    createCreditNoteMutate: createCreditNoteMutate as (
      values: CreateCreditNoteBody,
    ) => Promise<void>,
    editCreditNoteMutate: editCreditNoteMutate as (
      args: [number, EditCreditNoteBody],
    ) => Promise<void>,
    setSubmitPayload,

    creditNoteState,
  };

  return <CreditNoteFormContext.Provider value={provider} {...props} />;
}

const useCreditNoteFormContext = (): CreditNoteFormContextValue => {
  const ctx = React.useContext(CreditNoteFormContext);
  if (!ctx) {
    throw new Error(
      'useCreditNoteFormContext must be used within a CreditNoteFormProvider',
    );
  }
  return ctx;
};

export { CreditNoteFormProvider, useCreditNoteFormContext };
