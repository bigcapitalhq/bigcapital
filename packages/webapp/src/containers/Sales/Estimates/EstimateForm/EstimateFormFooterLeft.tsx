import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';
import { NS } from '@/constants/classes';

export function EstimateFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Customer Note --------- */}
      <EstimateMsgFormGroup
        name={'note'}
        label={intl.get('estimate_form.label.customer_note')}
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
        label={intl.get('estimate_form.label.terms_conditions')}
        name={'termsConditions'}
      >
        <FEditableText
          name={'termsConditions'}
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
  &.${NS}-form-group {
    margin-bottom: 40px;

    .${NS}-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .${NS}-form-content {
      margin-left: 10px;
    }
  }
`;

const TermsConditsFormGroup = styled(FFormGroup)`
  &.${NS}-form-group {
    .${NS}-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .${NS}-form-content {
      margin-left: 10px;
    }
  }
`;
