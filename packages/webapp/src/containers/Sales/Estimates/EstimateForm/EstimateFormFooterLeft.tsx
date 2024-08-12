// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function EstimateFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Customer Note --------- */}
      <EstimateMsgFormGroup
        name={'note'}
        label={<T id={'estimate_form.label.customer_note'} />}
        hintText={'Will be displayed on the invoice'}
      >
        <FEditableText
          name={'note'}
          placeholder={intl.get('estimate_form.customer_note.placeholder')}
          multiline
          fastField
        />
      </EstimateMsgFormGroup>

      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'estimate_form.label.terms_conditions'} />}
        name={'terms_conditions'}
      >
        <FEditableText
          name={'terms_conditions'}
          placeholder={intl.get(
            'estimate_form.terms_and_conditions.placeholder',
          )}
          multiline
          fastField
        />
      </TermsConditsFormGroup>
    </React.Fragment>
  );
}

const EstimateMsgFormGroup = styled(FFormGroup)`
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
