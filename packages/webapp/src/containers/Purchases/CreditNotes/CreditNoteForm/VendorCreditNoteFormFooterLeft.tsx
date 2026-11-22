import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';

export function VendorCreditNoteFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={intl.get('vendor_credit_form.label.note')}
        name={'note'}
      >
        <FEditableText
          name={'note'}
          placeholder={intl.get('vendor_credit_form.note.placeholder')}
          multiline
          fastField
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const TermsConditsFormGroup = styled(FFormGroup)`
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
