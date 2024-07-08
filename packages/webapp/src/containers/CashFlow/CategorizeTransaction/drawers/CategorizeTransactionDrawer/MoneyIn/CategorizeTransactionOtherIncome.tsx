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

export default function CategorizeTransactionOtherIncome() {
  const { accounts } = useCategorizeTransactionBoot();

  return (
    <>
      <FFormGroup name={'date'} label={'Date'} fastField inline>
        <FDateInput
          name={'date'}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          inputProps={{ fill: true, leftElement: <Icon icon={'date-range'} /> }}
        />
      </FFormGroup>

      <FFormGroup
        name={'debitAccountId'}
        label={'To Account'}
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
        label={'Income Account'}
        fastField
        inline
      >
        <AccountsSelect
          name={'creditAccountId'}
          items={accounts}
          filterByRootTypes={['income']}
          fastField
          fill
          allowCreate
        />
      </FFormGroup>

      <FFormGroup name={'referenceNo'} label={'Reference No.'} fastField inline>
        <FInputGroup name={'referenceNo'} fill />
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
