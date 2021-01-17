import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { inputIntent } from 'utils';
import { Row, Col  } from 'components';
import { FormattedMessage as T } from 'react-intl';
import { decrementCalc, dec } from './utils';

function DecrementAdjustmentFields() {
  return (
    <Row className={'row--decrement-fields'}>
      {/*------------ Quantity on hand  -----------*/}
      <Col className={'col--quantity-on-hand'}>
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

      <Col className={'col--sign'}>
        <span>–</span>
      </Col>
      
      {/*------------ Decrement -----------*/}
      <Col className={'col--decrement'}>
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
                  setFieldValue('new_quantity', decrementCalc(values, event));
                }}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>

      <Col className={'col--sign'}>
        <span>=</span>
      </Col>
      {/*------------ New quantity -----------*/}
      <Col className={'col--quantity'}>
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

export default DecrementAdjustmentFields;
