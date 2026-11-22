import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';

export function CreditNoteFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Customer notes --------- */}
      <CreditNoteMsgFormGroup
        name={'note'}
        label={intl.get('credit_note.label_customer_note')}
      >
        <FEditableText
          name={'note'}
          placeholder={intl.get('credit_note.label_customer_note.placeholder')}
          multiline
          fastField
        />
      </CreditNoteMsgFormGroup>
      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={intl.get('credit_note.label_terms_conditions')}
        name={'termsConditions'}
      >
        <FEditableText
          name={'termsConditions'}
          placeholder={intl.get(
            'credit_note.label_terms_and_conditions.placeholder',
          )}
          multiline
          fastField
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const CreditNoteMsgFormGroup = styled(FFormGroup)`
  &.bp6-form-group {
    margin-bottom: 40px;

    .bp6-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp6-form-content {
      margin-left: 10px;
    }
  }
`;

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
