// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FormGroup } from '@blueprintjs/core';
import { Box, FFormGroup, FSelect } from '@/components';
import { getAddMoneyInOptions, getAddMoneyOutOptions } from '@/constants';
import { useFormikContext } from 'formik';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';

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

      <CategorizeTransactionFormSubContent />
    </Box>
  );
}

const CategorizeTransactionOtherIncome = React.lazy(
  () => import('./MoneyIn/CategorizeTransactionOtherIncome'),
);

const CategorizeTransactionOwnerContribution = React.lazy(
  () => import('./MoneyIn/CategorizeTransactionOwnerContribution'),
);

const CategorizeTransactionTransferFrom = React.lazy(
  () => import('./MoneyIn/CategorizeTransactionTransferFrom'),
);

const CategorizeTransactionOtherExpense = React.lazy(
  () => import('./MoneyOut/CategorizeTransactionOtherExpense'),
);

const CategorizeTransactionToAccount = React.lazy(
  () => import('./MoneyOut/CategorizeTransactionToAccount'),
);

const CategorizeTransactionOwnerDrawings = React.lazy(
  () => import('./MoneyOut/CategorizeTransactionOwnerDrawings'),
);

function CategorizeTransactionFormSubContent() {
  const { values } = useFormikContext();

  // Other expense.
  if (values.transactionType === 'other_expense') {
    return <CategorizeTransactionOtherExpense />;
    // Owner contribution.
  } else if (values.transactionType === 'owner_contribution') {
    return <CategorizeTransactionOwnerContribution />;
    // Other Income.
  } else if (values.transactionType === 'other_income') {
    return <CategorizeTransactionOtherIncome />;
    // Transfer from account.
  } else if (values.transactionType === 'transfer_from_account') {
    return <CategorizeTransactionTransferFrom />;
    // Transfer to account.
  } else if (values.transactionType === 'transfer_to_account') {
    return <CategorizeTransactionToAccount />;
    // Owner drawings.
  } else if (values.transactionType === 'OwnerDrawing') {
    return <CategorizeTransactionOwnerDrawings />;
  }
  return null;
}
