import React from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import {
  useCreateVendorCredit,
  useEditVendorCredit,
  useVendorCredit,
  useItems,
  useVendors,
} from 'hooks/query';

const VendorCreditNoteFormContext = React.createContext();

/**
 * Vendor Credit note data provider.
 */
function VendorCreditNoteFormProvider({ vendorCreditId, ...props }) {
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

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } =
    useVendorCredit(vendorCreditId, {
      enabled: !!vendorCreditId,
    });

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Create and edit vendor credit mutations.
  const { mutateAsync: createVendorCreditMutate } = useCreateVendorCredit();
  const { mutateAsync: editVendorCreditMutate } = useEditVendorCredit();

  // Determines whether the form in new mode.
  const isNewMode = !vendorCreditId;

  // Provider payload.
  const provider = {
    items,
    vendors,
    vendorCredit,
    submitPayload,
    isNewMode,

    isVendorCreditLoading,

    createVendorCreditMutate,
    editVendorCreditMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isItemsLoading || isVendorsLoading || isVendorCreditLoading}
      name={'vendor-credits-form'}
    >
      <VendorCreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorCreditNoteFormContext = () =>
  React.useContext(VendorCreditNoteFormContext);

export { VendorCreditNoteFormProvider, useVendorCreditNoteFormContext };
