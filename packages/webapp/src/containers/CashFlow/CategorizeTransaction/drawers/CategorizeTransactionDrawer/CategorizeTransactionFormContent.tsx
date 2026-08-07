import { FormGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { lazy } from 'react';
import styled from 'styled-components';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import type { CategorizeTransactionFormValues } from './_utils';
import { Box, FFormGroup, FSelect } from '@/components';
import { getAddMoneyInOptions, getAddMoneyOutOptions } from '@/constants';

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

const CategorizeTransactionOtherIncome = lazy(() =>
  import('./MoneyIn/CategorizeTransactionOtherIncome').then((m) => ({
    default: m.CategorizeTransactionOtherIncome,
  })),
);
const CategorizeTransactionOwnerContribution = lazy(() =>
  import('./MoneyIn/CategorizeTransactionOwnerContribution').then((m) => ({
    default: m.CategorizeTransactionOwnerContribution,
  })),
);
const CategorizeTransactionTransferFrom = lazy(() =>
  import('./MoneyIn/CategorizeTransactionTransferFrom').then((m) => ({
    default: m.CategorizeTransactionTransferFrom,
  })),
);
const CategorizeTransactionOtherExpense = lazy(() =>
  import('./MoneyOut/CategorizeTransactionOtherExpense').then((m) => ({
    default: m.CategorizeTransactionOtherExpense,
  })),
);
const CategorizeTransactionToAccount = lazy(() =>
  import('./MoneyOut/CategorizeTransactionToAccount').then((m) => ({
    default: m.CategorizeTransactionToAccount,
  })),
);
const CategorizeTransactionOwnerDrawings = lazy(() =>
  import('./MoneyOut/CategorizeTransactionOwnerDrawings').then((m) => ({
    default: m.CategorizeTransactionOwnerDrawings,
  })),
);

function CategorizeTransactionFormSubContent() {
  const { values } = useFormikContext<CategorizeTransactionFormValues>();

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
  } else if (values.transactionType === 'owner_drawing') {
    return <CategorizeTransactionOwnerDrawings />;
  }
  return null;
}
