import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';

export function MakeJournalFormFooterLeft({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <DescriptionFormGroup
        label={intl.get('description')}
        name={'description'}
      >
        <FEditableText
          name={'description'}
          placeholder={intl.get('make_jorunal.decscrption.placeholder')}
          multiline
          fastField
        />
      </DescriptionFormGroup>

      {children}
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
