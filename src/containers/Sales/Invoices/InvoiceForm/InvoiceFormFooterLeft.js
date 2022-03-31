import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function InvoiceFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Invoice message --------- */}
      <InvoiceMsgFormGroup
        name={'invoice_message'}
        label={<T id={'invoice_message'} />}
      >
        <FEditableText
          name={'invoice_message'}
          placeholder={intl.get('invoice_form.invoice_message.placeholder')}
        />
      </InvoiceMsgFormGroup>

      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'invoice_form.label.terms_conditions'} />}
        name={'terms_conditions'}
      >
        <FEditableText
          name={'terms_conditions'}
          placeholder={intl.get(
            'invoice_form.terms_and_conditions.placeholder',
          )}
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
