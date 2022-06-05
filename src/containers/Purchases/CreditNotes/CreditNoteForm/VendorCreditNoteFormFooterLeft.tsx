import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function VendorCreditNoteFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'vendor_credit_form.label.note'} />}
        name={'note'}
      >
        <FEditableText
          name={'note'}
          placeholder={intl.get('vendor_credit_form.note.placeholder')}
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const TermsConditsFormGroup = styled(FFormGroup)`
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
