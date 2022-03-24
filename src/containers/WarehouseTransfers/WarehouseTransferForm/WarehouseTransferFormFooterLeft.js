import React from 'react';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function WarehouseTransferFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'terms_conditions'} />}
        name={'reason'}
      >
        <FEditableText
          name={'reason'}
          placeholder={
            'Enter the terms and conditions of your business to be displayed in your transaction'
          }
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
