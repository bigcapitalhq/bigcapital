import React from 'react';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function PaymentReceiveFormFootetLeft() {
  return (
    <React.Fragment>
      {/* --------- Statement--------- */}
      <TermsConditsFormGroup
        name={'statement'}
        label={<T id={'statement'} />}
        hintText={'Will be displayed on the Payment'}
      >
        <FEditableText
          name={'statement'}
          placeholder={'Thanks for your business and have a great day!'}
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

