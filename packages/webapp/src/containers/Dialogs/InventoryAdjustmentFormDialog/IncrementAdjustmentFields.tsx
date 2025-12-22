// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { useAutofocus } from '@/hooks';
import {
  Row,
  Col,
  FMoneyInputGroup,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';
import { toSafeNumber } from '@/utils';
import { decrementQuantity, incrementQuantity } from './utils';

export default function IncrementAdjustmentFields() {
  const incrementFieldRef = useAutofocus();
  const { values, setFieldValue } = useFormikContext();

  return (
    <Row>
      {/*------------ Quantity on hand  -----------*/}
      <Col className={'col--quantity-on-hand'}>
        <FFormGroup
          name={'quantity_on_hand'}
          label={<T id={'qty_on_hand'} />}
          fastField
        >
          <FInputGroup
            name={'quantity_on_hand'}
            disabled={true}
            medium={'true'}
            fastField
          />
        </FFormGroup>
      </Col>

      {/*------------ Sign -----------*/}
      <Col className={'col--sign'}>
        <span>+</span>
      </Col>

      {/*------------ Increment -----------*/}
      <Col className={'col--quantity'}>
        <FFormGroup
          name={'quantity'}
          label={<T id={'increment'} />}
          fill
          fastField
        >
          <FMoneyInputGroup
            name={'quantity'}
            allowDecimals={false}
            allowNegativeValue={true}
            inputRef={(ref) => (incrementFieldRef.current = ref)}
            onBlurValue={(value) => {
              setFieldValue(
                'new_quantity',
                incrementQuantity(
                  toSafeNumber(value),
                  toSafeNumber(values.quantity_on_hand),
                ),
              );
            }}
            fastField
          />
        </FFormGroup>
      </Col>

      {/*------------ Cost -----------*/}
      <Col className={'col--cost'}>
        <FFormGroup name={'cost'} label={<T id={'cost'} />} fastField>
          <FMoneyInputGroup name={'cost'} fastField />
        </FFormGroup>
      </Col>

      {/*------------ Sign -----------*/}
      <Col className={'col--sign'}>
        <span>=</span>
      </Col>

      {/*------------ New quantity -----------*/}
      <Col className={'col--quantity-on-hand'}>
        <FFormGroup
          name={'new_quantity'}
          label={<T id={'new_quantity'} />}
          fastField
        >
          <FMoneyInputGroup
            name={'new_quantity'}
            allowDecimals={false}
            allowNegativeValue={true}
            onBlurValue={(value) => {
              setFieldValue(
                'quantity',
                decrementQuantity(
                  toSafeNumber(value),
                  toSafeNumber(values.quantity_on_hand),
                ),
              );
            }}
            fastField
          />
        </FFormGroup>
      </Col>
    </Row>
  );
}
