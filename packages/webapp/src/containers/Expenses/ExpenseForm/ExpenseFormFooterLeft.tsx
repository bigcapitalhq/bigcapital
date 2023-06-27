// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function ExpenseFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <DescriptionFormGroup
        label={<T id={'description'} />}
        name={'description'}
      >
        <FEditableText
          name={'description'}
          placeholder={<T id={'expenses.description.placeholder'} />}
        />
      </DescriptionFormGroup>
    </React.Fragment>
  );
}
const DescriptionFormGroup = styled(FFormGroup)`
  &.bp3-form-group {
    .bp3-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp3-form-content {
      margin-left: 10px;
    }
  }
`;
