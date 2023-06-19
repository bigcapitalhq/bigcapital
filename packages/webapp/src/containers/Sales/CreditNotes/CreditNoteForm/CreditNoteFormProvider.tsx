// @ts-nocheck
import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import { DashboardInsider } from '@/components/Dashboard';
import { transformToEditForm } from './utils';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

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
} from '@/hooks/query';

const CreditNoteFormContext = React.createContext();

/**
 * Credit note data provider.
 */
function CreditNoteFormProvider({ creditNoteId, ...props }) {
  const { state } = useLocation();
  const invoiceId = state?.invoiceId;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
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
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
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

  // Handle fetching settings.
  useSettingsCreditNotes();

  // Create and edit credit note mutations.
  const { mutateAsync: createCreditNoteMutate } = useCreateCreditNote();
  const { mutateAsync: editCreditNoteMutate } = useEditCreditNote();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehousesLoading || isBranchesLoading;

  const newCreditNote = !isEmpty(invoice)
    ? transformToEditForm({
        ...pick(invoice, ['customer_id', 'currency_code', 'entries']),
      })
    : [];

  // Provider payload.
  const provider = {
    items,
    customers,
    creditNote,
    branches,
    warehouses,
    submitPayload,
    isNewMode,
    newCreditNote,

    isItemsLoading,
    isCustomersLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,

    createCreditNoteMutate,
    editCreditNoteMutate,
    setSubmitPayload,
  };

  const isLoading =
    isItemsLoading ||
    isCustomersLoading ||
    isCreditNoteLoading ||
    isInvoiceLoading;

  return (
    <DashboardInsider loading={isLoading} name={'credit-note-form'}>
      <CreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteFormContext = () => React.useContext(CreditNoteFormContext);

export { CreditNoteFormProvider, useCreditNoteFormContext };
