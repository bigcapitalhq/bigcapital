import React from 'react';
import { FastField } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { FormGroup, InputGroup, Radio } from '@blueprintjs/core';
import { Row, Col, ErrorMessage } from 'components';
import { inputIntent } from 'utils';

/**
 * Reference number form content.
 */
export default function ReferenceNumberFormContent() {
  return (
    <>
      <FastField name={'mode'}>
        {({ form, field, meta: { error, touched } }) => (
          <Radio
            label="Auto-incrementing invoice number."
            value="auto-increment"
            {...field}
          />
        )}
      </FastField>

      <Row>
        {/* ------------- Prefix ------------- */}
        <Col xs={6}>
          <FastField name={'prefix'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'prefix'} />}
                className={'form-group--'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'prefix'} />}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        {/* ------------- Next number ------------- */}
        <Col xs={6}>
          <FastField name={'next_number'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'next_number'} />}
                className={'form-group--'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'next_number'} />}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <FastField name={'mode'}>
        {({ form, field, meta: { error, touched } }) => (
          <Radio label="Manual entring for this transaction." value="manual" {...field} />
        )}
      </FastField>
    </>
  );
}
