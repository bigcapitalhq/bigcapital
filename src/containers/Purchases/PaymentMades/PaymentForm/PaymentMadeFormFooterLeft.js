import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from 'components';

export function PaymentMadeFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Statement--------- */}
      <StatementFormGroup
        name={'statement'}
        label={<T id={'payment_made_form.label.statement'} />}
        hintText={'Will be displayed on the Payment'}
      >
        <FEditableText
          name={'statement'}
          placeholder={intl.get('payment_made_form.statement.placeholder')}
        />
      </StatementFormGroup>
    </React.Fragment>
  );
}
const StatementFormGroup = styled(FFormGroup)`
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
