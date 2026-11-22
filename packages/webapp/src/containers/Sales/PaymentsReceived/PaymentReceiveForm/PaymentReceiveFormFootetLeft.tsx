import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';

export function PaymentReceiveFormFootetLeft() {
  return (
    <React.Fragment>
      {/* --------- Internal Note--------- */}
      <TermsConditsFormGroup
        name={'statement'}
        label={intl.get('payment_receive_form.label.note')}
        fastField={true}
      >
        <FEditableText
          name={'statement'}
          placeholder={intl.get(
            'payment_receive_form.internal_note.placeholder',
          )}
          fastField
          multiline
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
