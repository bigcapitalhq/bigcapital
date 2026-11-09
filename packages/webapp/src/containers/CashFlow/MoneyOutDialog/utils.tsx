import { useFormikContext } from 'formik';
import { isEqual, isNull, first } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import { useMoneyOutFieldsContext } from './MoneyOutFieldsProvider';
import type { MoneyOutFormValues } from './types';
import type { Account } from '@bigcapital/sdk-ts';

interface Branch {
  id: number;
  primary?: boolean;
}

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<MoneyOutFormValues>();
  const { branches, isBranchesSuccess } = useMoneyOutDialogContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch =
        (branches as Array<Branch> | undefined)?.find((b) => b.primary) ||
        first(branches as Array<Branch> | undefined);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useForeignAccount = () => {
  const { values } = useFormikContext<MoneyOutFormValues>();
  const { account } = useMoneyOutFieldsContext();

  const accountCurrency = (account as Account | undefined)?.currencyCode;
  return (
    !isEqual(accountCurrency, values.currencyCode) && !isNull(accountCurrency)
  );
};

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;

  .bp4-dark & {
    background: var(--color-dark-gray5);
  }
`;
