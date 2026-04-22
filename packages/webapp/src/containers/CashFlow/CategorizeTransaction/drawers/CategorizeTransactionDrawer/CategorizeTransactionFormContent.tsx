// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FormGroup } from '@blueprintjs/core';
import { Box, FFormGroup, FSelect } from '@/components';
import { getAddMoneyInOptions, getAddMoneyOutOptions } from '@/constants';
import { useField } from 'formik';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import CategorizeTransactionOtherIncome from './MoneyIn/CategorizeTransactionOtherIncome';
import CategorizeTransactionOwnerContribution from './MoneyIn/CategorizeTransactionOwnerContribution';
import CategorizeTransactionTransferFrom from './MoneyIn/CategorizeTransactionTransferFrom';
import CategorizeTransactionOtherExpense from './MoneyOut/CategorizeTransactionOtherExpense';
import CategorizeTransactionToAccount from './MoneyOut/CategorizeTransactionToAccount';
import CategorizeTransactionOwnerDrawings from './MoneyOut/CategorizeTransactionOwnerDrawings';

// Retrieves the add money in button options.
const MoneyInOptions = getAddMoneyInOptions();
const MoneyOutOptions = getAddMoneyOutOptions();

const Title = styled('h3')`
  font-size: 20px;
  font-weight: 400;
  color: #cd4246;
`;

export function CategorizeTransactionFormContent() {
  const { autofillCategorizeValues } = useCategorizeTransactionBoot();
  const [{ value: transactionType }] = useField('transactionType');

  const transactionTypes = autofillCategorizeValues?.isDepositTransaction
    ? MoneyInOptions
    : MoneyOutOptions;

  const formattedAmount = autofillCategorizeValues?.formattedAmount;

  return (
    <Box style={{ flex: 1, margin: 20 }}>
      <FormGroup label={'Amount'} inline>
        <Title>{formattedAmount}</Title>
      </FormGroup>

      <FFormGroup name={'category'} label={'Category'} fastField inline>
        <FSelect
          name={'transactionType'}
          items={transactionTypes}
          popoverProps={{ minimal: true }}
          valueAccessor={'value'}
          textAccessor={'name'}
          fill
        />
      </FFormGroup>

      <CategorizeTransactionFormSubContent transactionType={transactionType} />
    </Box>
  );
}

function CategorizeTransactionFormSubContent({ transactionType }) {
  if (transactionType === 'other_expense') {
    return <CategorizeTransactionOtherExpense />;
  } else if (transactionType === 'owner_contribution') {
    return <CategorizeTransactionOwnerContribution />;
  } else if (transactionType === 'other_income') {
    return <CategorizeTransactionOtherIncome />;
  } else if (transactionType === 'transfer_from_account') {
    return <CategorizeTransactionTransferFrom />;
  } else if (transactionType === 'transfer_to_account') {
    return <CategorizeTransactionToAccount />;
  } else if (transactionType === 'owner_drawing') {
    return <CategorizeTransactionOwnerDrawings />;
  }
  return null;
}
