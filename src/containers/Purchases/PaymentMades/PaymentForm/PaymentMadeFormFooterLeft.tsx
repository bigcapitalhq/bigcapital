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
        name={'internal_note'}
        label={<T id={'payment_made.form.internal_note.label'} />}
      >
        <FEditableText
          name={'internal_note'}
          placeholder={intl.get('payment_made.form.internal_note.placeholder')}
        />
      </InternalNoteFormGroup>
    </React.Fragment>
  );
}

const InternalNoteFormGroup = styled(FFormGroup)`
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
