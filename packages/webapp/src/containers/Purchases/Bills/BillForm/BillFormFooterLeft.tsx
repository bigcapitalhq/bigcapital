// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function BillFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- note --------- */}
      <TermsConditsFormGroup
        label={<T id={'bill_form.label.note'} />}
        name={'note'}
      >
        <FEditableText
          name={'note'}
          placeholder={intl.get('bill_form.label.note.placeholder')}
          fastField
          multiline
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const TermsConditsFormGroup = styled(FFormGroup)`
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
