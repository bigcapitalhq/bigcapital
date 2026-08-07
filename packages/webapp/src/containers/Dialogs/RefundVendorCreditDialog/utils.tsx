import { useFormikContext } from 'formik';
import { first } from 'lodash';
import React from 'react';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import type { RefundVendorCreditFormValues } from './types';

interface BranchItem {
  id: number | string;
  primary?: boolean;
  [key: string]: unknown;
}

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<RefundVendorCreditFormValues>();
  const { branches, isBranchesSuccess } = useRefundVendorCreditContext();

  React.useEffect(() => {
    if (isBranchesSuccess && branches) {
      const list = (branches as BranchItem[] | undefined) ?? [];
      const primaryBranch = list.find((b) => b.primary) || first(list);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
