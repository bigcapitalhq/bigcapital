import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Row, Col, FieldRequiredHint } from 'components';
import { inputIntent } from 'utils';
import { FormattedMessage as T } from 'react-intl';

function IncrementAdjustmentFields() {
  return (
    <Row>
      {/*------------ Quantity on hand  -----------*/}
      <Col sm={3}>
        <FastField name={'quantity'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'qty_on_hand'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="quantity" />}
            >
              <InputGroup disabled={true} medium={'true'} {...field} />
            </FormGroup>
          )}
        </FastField>
      </Col>
      {/*------------ Increment -----------*/}
      <Col sm={2}>
        <FastField name={'increment'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'increment'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="increment" />}
              fill={true}
            >
              <InputGroup medium={'true'} {...field} />
            </FormGroup>
          )}
        </FastField>
      </Col>
      {/*------------ Cost -----------*/}
      <Col sm={2}>
        <FastField name={'cost'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'cost'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="cost" />}
            >
              <InputGroup medium={'true'} {...field} />
            </FormGroup>
          )}
        </FastField>
      </Col>
      {/*------------ New quantity -----------*/}
      <Col sm={4}>
        <FastField name={'new_quantity'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'new_quantity'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="new_quantity" />}
            >
              <InputGroup medium={'true'} {...field} />
            </FormGroup>
          )}
        </FastField>
      </Col>
    </Row>
  );
}

export default IncrementAdjustmentFields;
