import React from 'react';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function ReceiptFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Receipt message --------- */}
      <ReceiptMsgFormGroup
        name={'receipt_message'}
        label={<T id={'receipt_message'} />}
        hintText={'Will be displayed on the Receipt'}
      >
        <FEditableText
          name={'receipt_message'}
          placeholder={
            <T id={'thanks_for_your_business_and_have_a_great_day'} />
          }
        />
      </ReceiptMsgFormGroup>

      {/* --------- Statement--------- */}
      <StatementFormGroup label={<T id={'statement'} />} name={'statement'}>
        <FEditableText
          name={'statement'}
          placeholder={
            'Enter the terms and conditions of your business to be displayed in your transaction'
          }
        />
      </StatementFormGroup>
    </React.Fragment>
  );
}

const ReceiptMsgFormGroup = styled(FFormGroup)`
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

const StatementFormGroup = styled(FFormGroup)`
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
