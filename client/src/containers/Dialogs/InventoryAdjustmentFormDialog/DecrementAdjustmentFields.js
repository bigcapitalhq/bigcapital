import React from 'react';
import { sumBy, subtract, add } from 'lodash';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { inputIntent } from 'utils';
import { Row, Col, If, FieldRequiredHint } from 'components';
import { FormattedMessage as T } from 'react-intl';
import { calculate } from './utils';

function DecrementAdjustmentFields() {
  return (
    <Row>
      {/*------------ Quantity on hand  -----------*/}
      <Col sm={3}>
        <FastField name={'quantity_on_hand'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'qty_on_hand'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="quantity_on_hand" />}
            >
              <InputGroup disabled={true} medium={'true'} {...field} />
            </FormGroup>
          )}
        </FastField>
      </Col>
      {/*------------ Decrement -----------*/}
      <Col sm={2}>
        <FastField name={'quantity'}>
          {({
            form: { values, setFieldValue },
            field,
            meta: { error, touched },
          }) => (
            <FormGroup
              label={<T id={'decrement'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="quantity" />}
              fill={true}
            >
              <InputGroup
                {...field}
                onBlur={(event) => {
                  setFieldValue('new_quantity', calculate(values, field.value));
                }}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>
      {/*------------ New quantity -----------*/}
      <Col sm={4}>
        <FastField name={'new_quantity'}>
          {({
            form: { values, setFieldValue },
            field,
            meta: { error, touched },
          }) => (
            <FormGroup
              label={<T id={'new_quantity'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="new_quantity" />}
            >
              <InputGroup
                medium={'true'}
                {...field}
                onBlur={(event) => {
                  setFieldValue(
                    'quantity',
                    subtract(field.value, values.quantity_on_hand),
                  );
                }}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>
    </Row>
  );
}

export default DecrementAdjustmentFields;
