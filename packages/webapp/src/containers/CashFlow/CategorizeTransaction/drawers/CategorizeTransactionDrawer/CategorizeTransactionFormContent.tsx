// @ts-nocheck
import { Position } from '@blueprintjs/core';
import styled from 'styled-components';
import {
  AccountsSelect,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FSelect,
  FSuggest,
  FTextArea,
} from '@/components';
import { getAddMoneyInOptions } from '@/constants';

// Retrieves the add money in button options.
const AddMoneyInOptions = getAddMoneyInOptions();

const Title = styled('h3')``;

export function CategorizeTransactionFormContent() {
  return (
    <>
      <Title>$22,583.00</Title>

      <FFormGroup name={'category'} label={'Category'} fastField inline>
        <FSuggest
          name={'transaction_type'}
          items={AddMoneyInOptions}
          popoverProps={{ minimal: true }}
          valueAccessor={'value'}
          textAccessor={'name'}
          fill
        />
      </FFormGroup>

      <FFormGroup name={'date'} label={'Date'} fastField inline>
        <FDateInput
          name={'date'}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          inputProps={{ fill: true }}
        />
      </FFormGroup>

      <FFormGroup
        name={'from_account_id'}
        label={'From Account'}
        fastField={true}
        inline
      >
        <AccountsSelect
          name={'from_account_id'}
          items={[]}
          fastField={true}
          fill={true}
          allowCreate={true}
        />
      </FFormGroup>

      <FFormGroup
        name={'toAccountId'}
        label={'To Account'}
        fastField={true}
        inline
      >
        <AccountsSelect
          name={'to_account_id'}
          items={[]}
          fastField={true}
          fill={true}
          allowCreate={true}
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
    </>
  );
}
