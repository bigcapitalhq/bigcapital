import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';

export function MakeJournalFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <DescriptionFormGroup
        label={intl.get('description')}
        name={'description'}
      >
        <div data-testId={'journal-description-input'}>
          <FEditableText
            name={'description'}
            placeholder={intl.get('make_jorunal.decscrption.placeholder')}
            multiline
            fastField
          />
        </div>
      </DescriptionFormGroup>
    </React.Fragment>
  );
}

const DescriptionFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    .bp4-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;
