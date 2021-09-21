import React, { createContext, useState } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useReceipt,
  useAccounts,
  useSettingsReceipts,
  useCustomers,
  useItems,
  useCreateReceipt,
  useEditReceipt,
} from 'hooks/query';

const ReceiptFormContext = createContext();

/**
 * Receipt form provider.
 */
function ReceiptFormProvider({ receiptId, ...props }) {
  // Fetch sale receipt details.
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    receiptId,
    {
      enabled: !!receiptId,
    },
  );
  // Fetch accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Filter all sellable items only.
  const stringifiedFilterRoles = React.useMemo(
    () =>
      JSON.stringify([
        { index: 1, fieldKey: 'sellable', value: true, condition: '&&', comparator: 'equals', },
        { index: 2, fieldKey: 'active', value: true, condition: '&&', comparator: 'equals' },
      ]),
    [],
  );

  // Handle fetch Items data table or list
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });

  // Fetch receipt settings.
  const { isLoading: isSettingLoading } = useSettingsReceipts();

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
    setSubmitPayload,
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
