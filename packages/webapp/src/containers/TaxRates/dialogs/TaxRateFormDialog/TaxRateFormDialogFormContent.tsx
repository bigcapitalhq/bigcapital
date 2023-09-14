import {
  FCheckbox,
  FFormGroup,
  FInputGroup,
  FieldHint,
  Hint,
} from '@/components';
import { Tag } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

/**
 *
 * @returns
 */
export default function TaxRateFormDialogContent() {
  return (
    <div>
      <FFormGroup
        name={'name'}
        label={'Name'}
        labelInfo={<Tag minimal>Required</Tag>}
        subLabel={
          'The name as you would like it to appear in customers invoices.'
        }
      >
        <FInputGroup name={'name'} />
      </FFormGroup>

      <FFormGroup
        name={'code'}
        label={'Code'}
        labelInfo={<Tag minimal>Required</Tag>}
      >
        <FInputGroup name={'code'} />
      </FFormGroup>

      <FFormGroup
        name={'rate'}
        label={'Rate (%)'}
        labelInfo={<Tag minimal>Required</Tag>}
      >
        <RateFormGroup
          name={'rate'}
          rightElement={<Tag minimal>%</Tag>}
          fill={false}
        />
      </FFormGroup>

      <FFormGroup
        name={'description'}
        label={'Description'}
        labelInfo={
          <FieldHint content="This description is for internal use only and will not be visiable to your customers." />
        }
      >
        <FInputGroup name={'description'} />
      </FFormGroup>

      <CompoundFormGroup name={'is_compound'}>
        <FCheckbox label={'Is compound'} name={'is_compound'} />
      </CompoundFormGroup>

      <CompoundFormGroup name={'is_non_recoverable'}>
        <FCheckbox label={'Is non recoverable'} name={'is_non_recoverable'} />
      </CompoundFormGroup>
    </div>
  );
}

const RateFormGroup = styled(FInputGroup)`
  max-width: 100px;
`;

const CompoundFormGroup = styled(FFormGroup)`
  margin-bottom: 0;
`;
