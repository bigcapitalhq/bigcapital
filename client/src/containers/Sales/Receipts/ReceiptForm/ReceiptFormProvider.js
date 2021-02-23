import React, { createContext, useState } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useReceipt,
  useAccounts,
  useSettings,
  useCustomers,
  useItems,
  useCreateReceipt,
  useEditReceipt
} from 'hooks/query';

const ReceiptFormContext = createContext();

/**
 * Receipt form provider.
 */
function ReceiptFormProvider({ receiptId, ...props }) {
  // Fetch sale receipt details.
  const { data: receipt, isFetching: isReceiptLoading } = useReceipt(
    receiptId,
    {
      enabled: !!receiptId,
    },
  );
  // Fetch accounts list.
  const { data: accounts, isFetching: isAccountsLoading } = useAccounts();

  // Fetch customers list.
  const {
    data: { customers },
    isFetching: isCustomersLoading,
  } = useCustomers();

  // Handle fetch Items data table or list
  const {
    data: { items },
    isFetching: isItemsLoading,
  } = useItems();

  // Fetch receipt settings.
  const { isLoading: isSettingLoading } = useSettings();

  const { mutateAsync: createReceiptMutate } = useCreateReceipt();
  const { mutateAsync: editReceiptMutate } = useEditReceipt();

  const [submitPayload, setSubmitPayload] = useState({});

  const isNewMode = !receiptId;

  const provider = {
    receiptId,
    receipt,
    accounts,
    customers,
    items,
    submitPayload,

    isNewMode,
    isReceiptLoading,
    isAccountsLoading,
    isCustomersLoading,
    isItemsLoading,
    isSettingLoading,

    createReceiptMutate,
    editReceiptMutate,
    setSubmitPayload
  };
  return (
    <DashboardInsider
      loading={
        isReceiptLoading ||
        isAccountsLoading ||
        isCustomersLoading ||
        isItemsLoading ||
        isSettingLoading
      }
      name={'receipt-form'}
    >
      <ReceiptFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useReceiptFormContext = () => React.useContext(ReceiptFormContext);

export { ReceiptFormProvider, useReceiptFormContext };
