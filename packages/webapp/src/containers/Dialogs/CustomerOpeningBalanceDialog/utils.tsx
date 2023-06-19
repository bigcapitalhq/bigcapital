// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { first, pick } from 'lodash';

import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useCustomerOpeningBalanceContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('opening_balance_branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export function transfromCustomerToForm(values) {
  return {
    ...pick(values, [
      'id',
      'opening_balance',
      'opening_balance_exchange_rate',
      'currency_code',
    ]),
  };
}
