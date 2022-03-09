import React from 'react';
import { useFormikContext } from 'formik';
import { first } from 'lodash';

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
