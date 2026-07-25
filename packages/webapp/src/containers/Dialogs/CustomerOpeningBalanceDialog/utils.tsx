import { useFormikContext } from 'formik';
import { first, pick } from 'lodash';
import React from 'react';
import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';

/**
 * Customer opening balance form values.
 *
 * Field names mirror the SDK `EditCustomerOpeningBalanceBody` shape
 * (`openingBalance`, `openingBalanceAt`, ...). The submit handler forwards
 * these values directly to `editCustomerOpeningBalance`.
 */
export interface CustomerOpeningBalanceFormValues {
  openingBalance: string | number;
  openingBalanceBranchId: string | number;
  openingBalanceExchangeRate: number;
  openingBalanceAt: string;
}

/** Customer-derived seed values pulled out of the customer record. */
export interface CustomerOpeningBalanceSeed {
  id?: number;
  openingBalance?: string | number;
  openingBalanceExchangeRate?: number;
  currencyCode?: string;
}

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } =
    useFormikContext<CustomerOpeningBalanceFormValues>();
  const { branches, isBranchesSuccess } = useCustomerOpeningBalanceContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('openingBalanceBranchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export function transfromCustomertoForm(
  values: Partial<CustomerOpeningBalanceSeed> | undefined | null,
): CustomerOpeningBalanceSeed {
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
