import React from 'react';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function InvoiceFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Invoice message --------- */}
      <InvoiceMsgFormGroup
        name={'invoice_message'}
        label={<T id={'invoice_message'} />}
        hintText={'Will be displayed on the invoice'}
      >
        <FEditableText
          name={'invoice_message'}
          placeholder={
            <T id={'thanks_for_your_business_and_have_a_great_day'} />
          }
        />
      </InvoiceMsgFormGroup>

      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'terms_conditions'} />}
        name={'terms_conditions'}
      >
        <FEditableText
          name={'terms_conditions'}
          placeholder={<T id={'terms_and_conditions.placeholder'} />}
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const InvoiceMsgFormGroup = styled(FFormGroup)`
  &.bp3-form-group {
    margin-bottom: 40px;

    .bp3-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp3-form-content {
      margin-left: 10px;
    }
  }
`;

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
