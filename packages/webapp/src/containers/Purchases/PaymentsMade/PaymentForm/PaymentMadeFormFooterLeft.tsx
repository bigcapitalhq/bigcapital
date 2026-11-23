import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText } from '@/components';
import { NS } from '@/constants/classes';

/**
 * Payment made form footer left-side.
 */
export function PaymentMadeFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Internal Note--------- */}
      <InternalNoteFormGroup
        name={'statement'}
        label={intl.get('payment_made.form.internal_note.label')}
        fastField={true}
      >
        <FEditableText
          name={'statement'}
          placeholder={intl.get('payment_made.form.internal_note.placeholder')}
          fastField
          multiline
        />
      </InternalNoteFormGroup>
    </React.Fragment>
  );
}

const InternalNoteFormGroup = styled(FFormGroup)`
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
