import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm } from './utils';

import {
  useCreditNote,
  useCreateCreditNote,
  useEditCreditNote,
  useItems,
  useCustomers,
} from 'hooks/query';

const CreditNoteFormContext = React.createContext();

/**
 * Credit note data provider.
 */
function CreditNoteFormProvider({ creditNoteId, ...props }) {
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

  // Handle fetch vendor credit details.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );

  // Create and edit credit note mutations.
  const { mutateAsync: createCreditNoteMutate } = useCreateCreditNote();
  const { mutateAsync: editCreditNoteMutate } = useEditCreditNote();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  // Provider payload.
  const provider = {
    items,
    customers,
    creditNote,
    submitPayload,
    isNewMode,

    isItemsLoading,
    isCustomersLoading,

    createCreditNoteMutate,
    editCreditNoteMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isItemsLoading || isCustomersLoading || isCreditNoteLoading}
      name={'credit-notes-form'}
    >
      <CreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteFormContext = () => React.useContext(CreditNoteFormContext);

export { CreditNoteFormProvider, useCreditNoteFormContext };
