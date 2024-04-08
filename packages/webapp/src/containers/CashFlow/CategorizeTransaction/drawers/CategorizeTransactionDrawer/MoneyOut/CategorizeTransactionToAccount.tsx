
import { Position } from '@blueprintjs/core';
import { AccountsSelect, FDateInput, FFormGroup, FInputGroup, FTextArea } from '@/components';
import { useCategorizeTransactionBoot } from '../CategorizeTransactionBoot';

export default function CategorizeTransactionToAccount() {
  const { accounts } = useCategorizeTransactionBoot();

  return (
    <>
      <FFormGroup name={'date'} label={'Date'} fastField inline>
        <FDateInput
          name={'date'}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          inputProps={{ fill: true }}
        />
      </FFormGroup>

      <FFormGroup name={'debitAccountId'} label={'From Account'} fastField inline>
        <AccountsSelect name={'debitAccountId'} items={accounts} fastField fill allowCreate disabled />
      </FFormGroup>

      <FFormGroup name={'creditAccountId'} label={'To Account'} fastField inline>
        <AccountsSelect
          name={'creditAccountId'}
          items={accounts}
          filterByRootTypes={['assset']}
          fastField
          fill
          allowCreate
        />
      </FFormGroup>

      <FFormGroup name={'referenceNo'} label={'Reference No.'} fastField inline>
        <FInputGroup name={'reference_no'} fill />
      </FFormGroup>

      <FFormGroup name={'description'} label={'Description'} fastField inline>
        <FTextArea name={'description'} growVertically={true} large={true} fill={true} />
      </FFormGroup>
    </>
  );
}
