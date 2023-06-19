// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function PaymentReceiveFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Statement--------- */}
      <PaymentMsgFormGroup
        name={'message'}
        label={<T id={'payment_receive_form.message.label'} />}
      >
        <FEditableText
          name={'message'}
          placeholder={intl.get('payment_receive_form.message.placeholder')}
        />
      </PaymentMsgFormGroup>

      {/* --------- Internal Note--------- */}
      <TermsConditsFormGroup
        name={'internal_note'}
        label={<T id={'payment_receive_form.label.note'} />}
      >
        <FEditableText
          name={'internal_note'}
          placeholder={intl.get('payment_receive_form.internal_note.placeholder')}
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

const PaymentMsgFormGroup = styled(FFormGroup)`
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
