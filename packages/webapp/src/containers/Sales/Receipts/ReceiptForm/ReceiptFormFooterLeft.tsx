// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function ReceiptFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Receipt message --------- */}
      <ReceiptMsgFormGroup
        name={'receipt_message'}
        label={<T id={'receipt_form.label.receipt_message'} />}
        hintText={'Will be displayed on the Receipt'}
      >
        <FEditableText
          name={'receipt_message'}
          placeholder={intl.get('receipt_form.receipt_message.placeholder')}
          multiline
          fastField
        />
      </ReceiptMsgFormGroup>

      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'receipt_form.label.terms_conditions'} />}
        name={'terms_conditions'}
      >
        <FEditableText
          name={'terms_conditions'}
          placeholder={intl.get(
            'receipt_form.terms_and_conditions.placeholder',
          )}
          multiline
          fastField
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const ReceiptMsgFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    margin-bottom: 40px;

    .bp4-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;

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
