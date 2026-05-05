// @ts-nocheck
import { Position } from '@blueprintjs/core';
import {
  AccountsSelect,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FTextArea,
  Icon,
} from '@/components';
import { useCategorizeTransactionBoot } from '../CategorizeTransactionBoot';
import { CategorizeTransactionBranchField } from '../CategorizeTransactionBranchField';
import { momentFormatter } from '@/utils';

export default function CategorizeTransactionOtherExpense() {
  const { accounts, autofillCategorizeValues } = useCategorizeTransactionBoot();
  const isRefund = autofillCategorizeValues?.isDepositTransaction;

  return (
    <>
      <FFormGroup name={'date'} label={'Date'} fastField inline>
        <FDateInput
          name={'date'}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          {...momentFormatter('MM/DD/YYYY')}
          inputProps={{ fill: true, leftElement: <Icon icon={'date-range'} /> }}
        />
      </FFormGroup>

      <FFormGroup
        name={'debitAccountId'}
        label={isRefund ? 'Deposit Account' : 'Payment Account'}
        fastField={true}
        inline
      >
        <AccountsSelect
          name={'debitAccountId'}
          items={accounts}
          fastField
          fill
          allowCreate
          disabled
        />
      </FFormGroup>

      <FFormGroup
        name={'creditAccountId'}
        label={isRefund ? 'Refund Category' : 'Expense Account'}
        fastField={true}
        inline
      >
        <AccountsSelect
          name={'creditAccountId'}
          items={accounts}
          filterByRootTypes={['expense']}
          fastField
          fill
          allowCreate
        />
      </FFormGroup>

      <FFormGroup name={'referenceNo'} label={'Reference No.'} fastField inline>
        <FInputGroup name={'reference_no'} fill />
      </FFormGroup>

      <FFormGroup name={'description'} label={'Description'} fastField inline>
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          fill={true}
        />
      </FFormGroup>

      <CategorizeTransactionBranchField />
    </>
  );
}
