// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

/**
 * Payment made form footer left-side.
 * @returns {JSX.Element}
 */
export function PaymentMadeFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Internal Note--------- */}
      <InternalNoteFormGroup
        name={'statement'}
        label={<T id={'payment_made.form.internal_note.label'} />}
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
