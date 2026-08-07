import { useFormikContext } from 'formik';
import { first } from 'lodash';
import React from 'react';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';
import type { RefundCreditNoteFormValues } from './types';

interface BranchItem {
  id: number | string;
  primary?: boolean;
  [key: string]: unknown;
}

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<RefundCreditNoteFormValues>();
  const { branches, isBranchesSuccess } = useRefundCreditNoteContext();

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
