// @ts-nocheck
import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import { DashboardInsider } from '@/components/Dashboard';
import { transformToEditForm } from './utils';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useCreateVendorCredit,
  useEditVendorCredit,
  useVendorCredit,
  useWarehouses,
  useBranches,
  useItems,
  useVendors,
  useSettingsVendorCredits,
  useBill,
} from '@/hooks/query';

const VendorCreditNoteFormContext = React.createContext();

/**
 * Vendor Credit note data provider.
 */
function VendorCreditNoteFormProvider({ vendorCreditId, ...props }) {
  const { state } = useLocation();
  const billId = state?.billId;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
  });

  // Handle fetching settings.
  useSettingsVendorCredits();

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

  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
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

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Create and edit vendor credit mutations.
  const { mutateAsync: createVendorCreditMutate } = useCreateVendorCredit();
  const { mutateAsync: editVendorCreditMutate } = useEditVendorCredit();

  // Determines whether the form in new mode.
  const isNewMode = !vendorCreditId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehousesLoading || isBranchesLoading;

  const newVendorCredit = !isEmpty(bill)
    ? transformToEditForm({
        ...pick(bill, ['vendor_id', 'currency_code', 'entries']),
      })
    : [];

  // Provider payload.
  const provider = {
    items,
    vendors,
    vendorCredit,
    warehouses,
    branches,
    submitPayload,
    isNewMode,
    newVendorCredit,

    isVendorCreditLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,

    createVendorCreditMutate,
    editVendorCreditMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={
        isVendorCreditLoading ||
        isItemsLoading ||
        isVendorsLoading ||
        isVendorCreditLoading ||
        isBillLoading
      }
      name={'vendor-credit-form'}
    >
      <VendorCreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorCreditNoteFormContext = () =>
  React.useContext(VendorCreditNoteFormContext);

export { VendorCreditNoteFormProvider, useVendorCreditNoteFormContext };
