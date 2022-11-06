// @ts-nocheck
import React from 'react';
import { FastField, useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';
import { FormGroup, InputGroup, Radio } from '@blueprintjs/core';
import { If, Row, Col, ErrorMessage } from '@/components';
import { inputIntent } from '@/utils';

/**
 * Reference number form content.
 */
export default function ReferenceNumberFormContent() {
  const { values } = useFormikContext();

  return (
    <>
      {/* ------------- Auto increment mode ------------- */}
      <FastField name={'incrementMode'}>
        {({ form, field, meta: { error, touched } }) => (
          <Radio
            label={<T id={'auto_increment.field.auto'} />}
            value="auto-increment"
            onChange={() => {
              form.setFieldValue('incrementMode', 'auto');
            }}
            checked={field.value === 'auto'}
          />
        )}
      </FastField>

      <If condition={values.incrementMode === 'auto'}>
        <Row>
          {/* ------------- Prefix ------------- */}
          <Col xs={4}>
            <FastField name={'numberPrefix'}>
              {({ form, field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'prefix'} />}
                  className={'form-group--'}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name={'numberPrefix'} />}
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
            <FastField name={'nextNumber'}>
              {({ form, field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'next_number'} />}
                  className={'form-group--next-number'}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name={'nextNumber'} />}
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
      </If>

      {/* ------------- Manual increment mode ------------- */}
      <FastField name={'incrementMode'}>
        {({ form, field, meta: { error, touched } }) => (
          <Radio
            label={<T id={'auto_increment.field.manual_this_transaction'} />}
            value="manual"
            onChange={() => {
              form.setFieldValue('incrementMode', 'manual');
            }}
            checked={field.value === 'manual'}
          />
        )}
      </FastField>

      {/* ------------- Transaction manual increment mode ------------- */}
      <If condition={values.manualTransactionNo}>
        <FastField name={'incrementMode'}>
          {({ form, field, meta: { error, touched } }) => (
            <Radio
              label={<T id={'auto_increment.field.manually'} />}
              value="manual"
              onChange={() => {
                form.setFieldValue('incrementMode', 'manual-transaction');
              }}
              checked={field.value === 'manual-transaction'}
            />
          )}
        </FastField>
      </If>
    </>
  );
}
