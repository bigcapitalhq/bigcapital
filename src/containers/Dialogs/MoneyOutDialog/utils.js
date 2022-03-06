import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { transactionNumber } from 'utils';
import { first } from 'lodash';

import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

export const useObserveTransactionNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const TransactionNo = transactionNumber(prefix, nextNumber);
    setFieldValue('transacttion_numner', TransactionNo);
  }, [setFieldValue, prefix, nextNumber]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useMoneyOutDialogContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;
`;
