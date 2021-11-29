import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm } from './utils';

import { useBill, useItems, useVendors } from 'hooks/query';

const VendorCreditNoteFormContext = React.createContext();

/**
 * Vendor Credit note data provider.
 */
function VendorCreditNoteFormProvider({ creditNoteId, ...props }) {
  const { state } = useLocation();
  const billId = state?.action;

  // Fetches the bill by the given id.
  const { data: bill, isLoading: isBillLoading } = useBill(billId, {
    enabled: !!billId,
  });

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
  });

  // Handle fetch vendors data table or list
  const {
    data: { vendors },
    isLoading: isVendorsLoading,
  } = useVendors({ page_size: 10000 });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  // Provider payload.
  const provider = {
    bill,
    items,
    vendors,
    billId,
    submitPayload,

    setSubmitPayload,
    isNewMode,
  };

  return (
    <DashboardInsider
      loading={isBillLoading || isItemsLoading || isVendorsLoading}
      name={'vendor-credit-note-form'}
    >
      <VendorCreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorCreditNoteFormContext = () =>
  React.useContext(VendorCreditNoteFormContext);

export { VendorCreditNoteFormProvider , useVendorCreditNoteFormContext };
