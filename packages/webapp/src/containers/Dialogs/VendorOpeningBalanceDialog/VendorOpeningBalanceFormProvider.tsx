import React from 'react';
import { transfromVendorToForm } from './utils';
import type { Branch } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useBranches,
  useVendor,
  useEditVendorOpeningBalance,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseEditVendorOpeningBalanceResult = ReturnType<
  typeof useEditVendorOpeningBalance
>;

export interface VendorOpeningBalanceFormContextValue {
  branches: Branch[];
  vendor: ReturnType<typeof transfromVendorToForm>;
  isBranchesSuccess: boolean;
  isBranchesLoading: boolean;
  dialogName: string;
  editVendorOpeningBalanceMutate: UseEditVendorOpeningBalanceResult['mutateAsync'];
}

interface VendorOpeningBalanceFormProviderProps {
  query?: Record<string, unknown>;
  vendorId: number | undefined;
  dialogName: string;
  children?: React.ReactNode;
}

const VendorOpeningBalanceContext = React.createContext<
  VendorOpeningBalanceFormContextValue | undefined
>(undefined);

/**
 * Vendor Opening balance provider.
 */
function VendorOpeningBalanceFormProvider({
  query,
  vendorId,
  dialogName,
  children,
}: VendorOpeningBalanceFormProviderProps) {
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
  const provider: VendorOpeningBalanceFormContextValue = {
    branches: branches ?? [],
    vendor: transfromVendorToForm(vendor),
    isBranchesSuccess,
    isBranchesLoading,
    dialogName,
    editVendorOpeningBalanceMutate,
  };

  return (
    <DialogContent isLoading={isBranchesLoading || isVendorLoading}>
      <VendorOpeningBalanceContext.Provider value={provider}>
        {children}
      </VendorOpeningBalanceContext.Provider>
    </DialogContent>
  );
}

const useVendorOpeningBalanceContext =
  (): VendorOpeningBalanceFormContextValue => {
    const ctx = React.useContext(VendorOpeningBalanceContext);
    if (!ctx) {
      throw new Error(
        'useVendorOpeningBalanceContext must be used within VendorOpeningBalanceFormProvider',
      );
    }
    return ctx;
  };

export { VendorOpeningBalanceFormProvider, useVendorOpeningBalanceContext };
