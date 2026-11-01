import { Radio } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { ReferenceNumberFormValues } from './types';
import { Row, Col, FFormGroup, FInputGroup, FRadioGroup } from '@/components';

/**
 * Reference number form content.
 */
export function ReferenceNumberFormContent() {
  return (
    <>
      {/* ------------- Auto increment mode ------------- */}
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio label={intl.get('auto_increment.field.auto')} value="auto" />
      </FRadioGroup>
      <ReferenceNumberAutoIncrement />

      {/* ------------- Manual increment mode ------------- */}
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio
          label={intl.get('auto_increment.field.manually')}
          value="manual"
        />
      </FRadioGroup>

      {/* ------------- Transaction manual increment mode ------------- */}
      <ReferenceNumberManualOnce />
    </>
  );
}

function ReferenceNumberAutoIncrement() {
  const { values } = useFormikContext<ReferenceNumberFormValues>();
  if (values.incrementMode !== 'auto') return null;

  return (
    <Row>
      {/* ------------- Prefix ------------- */}
      <Col xs={4}>
        <FFormGroup
          name={'numberPrefix'}
          label={intl.get('prefix')}
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
          label={intl.get('next_number')}
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
  const { values } = useFormikContext<ReferenceNumberFormValues>();

  // Do not show the field if the one manual transaction number is not presented.
  if (!values.onceManualNumber) return null;

  return (
    <FFormGroup name={'incrementMode'} fastField>
      <FRadioGroup name={'incrementMode'} fastField>
        <Radio
          label={intl.get('auto_increment.field.manual_this_transaction')}
          value="manual-transaction"
        />
      </FRadioGroup>
    </FFormGroup>
  );
}
