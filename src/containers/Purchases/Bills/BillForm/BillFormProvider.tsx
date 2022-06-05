import React, { createContext, useState } from 'react';
import { isEqual, isUndefined } from 'lodash';
import { Features } from 'common';
import { useFeatureCan } from 'hooks/state';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
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
} from 'hooks/query';

const BillFormContext = createContext();

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

/**
 * Bill form provider.
 */
function BillFormProvider({ billId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch vendors data table
  const {
    data: { vendors },
    isLoading: isVendorsLoading,
  } = useVendors({ page_size: 10000 });

  // Handle fetch Items data table or list
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
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
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Handle fetching bill settings.
  const { isFetching: isSettingLoading } = useSettings();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // Create and edit bills mutations.
  const { mutateAsync: createBillMutate } = useCreateBill();
  const { mutateAsync: editBillMutate } = useEditBill();

  const isNewMode = !billId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const provider = {
    accounts,
    vendors,
    items,
    bill,
    warehouses,
    branches,
    submitPayload,
    isNewMode,

    isSettingLoading,
    isBillLoading,
    isAccountsLoading,
    isItemsLoading,
    isVendorsLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,

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

const useBillFormContext = () => React.useContext(BillFormContext);

export { BillFormProvider, useBillFormContext };
