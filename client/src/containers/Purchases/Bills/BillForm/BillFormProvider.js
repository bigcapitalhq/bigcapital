import React, { createContext, useState } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useAccounts,
  useVendors,
  useItems,
  useBill,
  useSettings,
  useCreateBill,
  useEditBill
} from 'hooks/query';

const BillFormContext = createContext();

/**
 * Bill form provider.
 */
function BillFormProvider({ billId, ...props }) {
  // Handle fetch accounts.
  const { data: accounts, isFetching: isAccountsLoading } = useAccounts();

  // Handle fetch vendors data table
  const {
    data: { vendors },
    isFetching: isVendorsLoading,
  } = useVendors({ page_size: 10000 });

  // Handle fetch Items data table or list
  const {
    data: { items },
    isFetching: isItemsLoading,
  } = useItems({ page_size: 10000 });

  // Handle fetch bill details.
  const { data: bill, isFetching: isBillLoading } = useBill(billId, {
    enabled: !!billId,
  });

  // Handle fetching bill settings.
  const { isFetching: isSettingLoading } = useSettings();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // Create and edit bills mutations.
  const { mutateAsync: createBillMutate } = useCreateBill();
  const { mutateAsync: editBillMutate } = useEditBill();

  const isNewMode = !billId;

  const provider = {
    accounts,
    vendors,
    items,
    bill,
    submitPayload,
    isNewMode,

    isSettingLoading,
    isBillLoading,
    isAccountsLoading,
    isItemsLoading,
    isVendorsLoading,

    createBillMutate,
    editBillMutate,
    setSubmitPayload
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

const useBillFormContext = () => React.useContext(BillFormContext);

export { BillFormProvider, useBillFormContext };
