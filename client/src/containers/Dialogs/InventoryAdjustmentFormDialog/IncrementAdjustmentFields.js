import React from 'react';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Row, Col, FieldRequiredHint } from 'components';
import { inputIntent } from 'utils';
import { FormattedMessage as T } from 'react-intl';
import { decrementCalc, incrementCalc } from './utils';

function IncrementAdjustmentFields() {
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
      {/*------------ Increment -----------*/}
      <Col sm={2}>
        <FastField name={'quantity'}>
          {({
            form: { values, setFieldValue },
            field,
            meta: { error, touched },
          }) => (
            <FormGroup
              label={<T id={'increment'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="quantity" />}
              fill={true}
            >
              <InputGroup
                {...field}
                onBlur={(event) => {
                  setFieldValue('new_quantity', incrementCalc(values, event));
                }}
              />
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
                {...field}
                onBlur={(event) => {
                  setFieldValue('quantity', decrementCalc(values, event));
                }}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>
    </Row>
  );
}

export default IncrementAdjustmentFields;
