import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { Row, Col, FieldRequiredHint } from 'components';
import { inputIntent } from 'utils';
import { FormattedMessage as T } from 'react-intl';

function DecrementAdjustmentFields() {
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
      {/*------------ Decrement -----------*/}
      <Col sm={2}>
        <FastField name={'decrement'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'decrement'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="decrement" />}
              fill={true}
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

export default DecrementAdjustmentFields;
