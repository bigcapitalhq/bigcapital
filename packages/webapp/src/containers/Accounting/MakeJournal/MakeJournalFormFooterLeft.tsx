// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function MakeJournalFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <DescriptionFormGroup
        label={<T id={'description'} />}
        name={'description'}
      >
        <FEditableText
          name={'description'}
          placeholder={intl.get('make_journal.description.placeholder')}
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
