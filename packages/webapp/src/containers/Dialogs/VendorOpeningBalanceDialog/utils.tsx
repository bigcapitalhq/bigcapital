import { useFormikContext } from 'formik';
import { first, pick } from 'lodash';
import React from 'react';
import { useVendorOpeningBalanceContext } from './VendorOpeningBalanceFormProvider';

/**
 * Vendor opening balance form values.
 *
 * Field names mirror the SDK `EditVendorOpeningBalanceBody` shape
 * (`openingBalance`, `openingBalanceAt`, ...). The submit handler forwards
 * these values directly to `editVendorOpeningBalance`.
 */
export interface VendorOpeningBalanceFormValues {
  openingBalance: string | number;
  openingBalanceBranchId: string | number;
  openingBalanceExchangeRate: number;
  openingBalanceAt: string;
}

/** Vendor-derived seed values pulled out of the vendor record. */
export interface VendorOpeningBalanceSeed {
  id?: number;
  openingBalance?: string | number;
  openingBalanceExchangeRate?: number;
  currencyCode?: string;
}

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<VendorOpeningBalanceFormValues>();
  const { branches, isBranchesSuccess } = useVendorOpeningBalanceContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('openingBalanceBranchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export function transfromVendorToForm(
  values: Partial<VendorOpeningBalanceSeed> | undefined | null,
): VendorOpeningBalanceSeed {
  if (!values) {
    return {};
  }
  return {
    ...pick(values, [
      'id',
      'openingBalance',
      'openingBalanceExchangeRate',
      'currencyCode',
    ]),
  };
}
