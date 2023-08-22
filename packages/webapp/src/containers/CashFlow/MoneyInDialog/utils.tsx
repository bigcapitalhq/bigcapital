// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { transactionNumber } from '@/utils';
import { isEqual, isNull, first } from 'lodash';

import { useMoneyInDailogContext } from './MoneyInDialogProvider';
import { useMoneyInFieldsContext } from './MoneyInFieldsProvider';

export const useObserveTransactionNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const TransactionNo = transactionNumber(prefix, nextNumber);
    setFieldValue('transacttion_numner', TransactionNo);
  }, [setFieldValue, prefix, nextNumber]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useMoneyInDailogContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useForeignAccount = () => {
  const { values } = useFormikContext();
  const { account } = useMoneyInFieldsContext();

  return (
    !isEqual(account.currency_code, values.currency_code) &&
    !isNull(account.currency_code)
  );
};

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;
`;
