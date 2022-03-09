import React from 'react';
import { DialogContent } from 'components';
import {
  useBranches,
  useVendor,
  useEditVendorOpeningBalance,
} from 'hooks/query';
import { useFeatureCan } from 'hooks/state';
import { Features } from 'common';
import { pick, defaultTo } from 'lodash';

const VendorOpeningBalanceContext = React.createContext();

/**
 * Vendor Opening balance provider.
 * @returns
 */
function VendorOpeningBalanceFormProvider({
  query,
  vendorId,
  dialogName,
  ...props
}) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { mutateAsync: editVendorOpeningBalanceMutate } =
    useEditVendorOpeningBalance();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Handle fetch vendor details.
  const { data: vendor, isLoading: isVendorLoading } = useVendor(vendorId, {
    enabled: !!vendorId,
  });

  // State provider.
  const provider = {
    branches,
    vendor: {
      ...pick(vendor, [
        'id',
        'opening_balance',
        'opening_balance_exchange_rate',
        'currency_code',
      ]),
    },

    isBranchesSuccess,
    isBranchesLoading,
    dialogName,
    editVendorOpeningBalanceMutate,
  };

  return (
    <DialogContent isLoading={isBranchesLoading || isVendorLoading}>
      <VendorOpeningBalanceContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useVendorOpeningBalanceContext = () =>
  React.useContext(VendorOpeningBalanceContext);

export { VendorOpeningBalanceFormProvider, useVendorOpeningBalanceContext };
