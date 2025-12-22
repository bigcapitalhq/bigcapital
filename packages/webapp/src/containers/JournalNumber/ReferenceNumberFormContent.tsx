// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Radio } from '@blueprintjs/core';

import {
  FormattedMessage as T,
  Row,
  Col,
  FFormGroup,
  FInputGroup,
  FRadioGroup,
} from '@/components';

/**
 * Reference number form content.
 */
export default function ReferenceNumberFormContent() {
  return (
    <>
      {/* ------------- Auto increment mode ------------- */}
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio
          label={<T id={'auto_increment.field.auto'} />}
          value="auto"
        />
      </FRadioGroup>
      <ReferenceNumberAutoIncrement />

      {/* ------------- Manual increment mode ------------- */}
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio
          label={<T id={'auto_increment.field.manually'} />}
          value="manual"
        />
      </FRadioGroup>

      {/* ------------- Transaction manual increment mode ------------- */}
      <ReferenceNumberManualOnce />
    </>
  );
}

function ReferenceNumberAutoIncrement() {
  const { values } = useFormikContext();
  if (values.incrementMode !== 'auto') return null;

  return (
    <Row>
      {/* ------------- Prefix ------------- */}
      <Col xs={4}>
        <FFormGroup
          name={'numberPrefix'}
          label={<T id={'prefix'} />}
          className={'form-group--'}
          fastField
        >
          <FInputGroup name={'numberPrefix'} fastField />
        </FFormGroup>
      </Col>

      {/* ------------- Next number ------------- */}
      <Col xs={6}>
        <FFormGroup
          name={'nextNumber'}
          label={<T id={'next_number'} />}
          className={'form-group--next-number'}
          fastField
        >
          <FInputGroup name={'nextNumber'} fastField />
        </FFormGroup>
      </Col>
    </Row>
  );
}

function ReferenceNumberManualOnce() {
  const { values } = useFormikContext();

  // Do not show the field if the one manual transaction number is not presented.
  if (!values.onceManualNumber) return null;

  return (
    <FFormGroup name={'incrementMode'} fastField>
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio
          label={<T id={'auto_increment.field.manual_this_transaction'} />}
          value="manual-transaction"
        />
      </FRadioGroup>
    </FFormGroup>
  );
}
