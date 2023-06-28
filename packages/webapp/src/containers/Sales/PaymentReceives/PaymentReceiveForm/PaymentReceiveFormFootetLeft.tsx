// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function PaymentReceiveFormFootetLeft() {
  return (
    <React.Fragment>
      {/* --------- Internal Note--------- */}
      <TermsConditsFormGroup
        name={'statement'}
        label={<T id={'payment_receive_form.label.note'} />}
        fastField={true}
      >
        <FEditableText
          name={'statement'}
          placeholder={intl.get(
            'payment_receive_form.internal_note.placeholder',
          )}
          fastField={true}
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
