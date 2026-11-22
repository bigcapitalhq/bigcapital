import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function ExpenseFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <DescriptionFormGroup
        label={intl.get('description')}
        name={'description'}
      >
        <FEditableText
          name={'description'}
          placeholder={(<T id={'expenses.decscrption.placeholder'} />) as any}
          multiline
          fastField
        />
      </DescriptionFormGroup>
    </React.Fragment>
  );
}
const DescriptionFormGroup = styled(FFormGroup)`
  &.bp6-form-group {
    .bp6-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp6-form-content {
      margin-left: 10px;
    }
  }
`;
