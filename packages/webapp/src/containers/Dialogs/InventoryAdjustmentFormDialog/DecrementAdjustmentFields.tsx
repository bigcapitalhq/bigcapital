import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { decrementQuantity } from './utils';
import type { InventoryAdjustmentFormValues } from './types';
import {
  Row,
  Col,
  FMoneyInputGroup,
  FFormGroup,
  FInputGroup,
} from '@/components';
import { useAutofocus } from '@/hooks';
import { toSafeNumber } from '@/utils';

export function DecrementAdjustmentFields(): React.ReactElement {
  const decrementFieldRef = useAutofocus<HTMLInputElement>();
  const { values, setFieldValue } =
    useFormikContext<InventoryAdjustmentFormValues>();

  return (
    <Row className={'row--decrement-fields'}>
      <Col className={'col--quantity-on-hand'}>
        <FFormGroup name={'quantityOnHand'} label={intl.get('qty_on_hand')}>
          <FInputGroup name={'quantityOnHand'} disabled={true} />
        </FFormGroup>
      </Col>

      <Col className={'col--sign'}>
        <span>–</span>
      </Col>

      <Col className={'col--decrement'}>
        <FFormGroup name={'quantity'} label={intl.get('decrement')}>
          <FMoneyInputGroup
            name={'quantity'}
            allowDecimals={false}
            allowNegativeValue={true}
            inputRef={(ref: HTMLInputElement | null) => {
              decrementFieldRef.current = ref;
            }}
            onBlurValue={(value: string) => {
              setFieldValue(
                'newQuantity',
                decrementQuantity(
                  toSafeNumber(value),
                  toSafeNumber(values.quantityOnHand),
                ),
              );
            }}
          />
        </FFormGroup>
      </Col>

      <Col className={'col--sign'}>
        <span>=</span>
      </Col>
      <Col className={'col--quantity'}>
        <FFormGroup
          name={'newQuantity'}
          label={intl.get('new_quantity')}
          fastField
        >
          <FMoneyInputGroup
            name={'newQuantity'}
            allowDecimals={false}
            allowNegativeValue={true}
            onBlurValue={(value: string) => {
              setFieldValue(
                'quantity',
                decrementQuantity(
                  toSafeNumber(value),
                  toSafeNumber(values.quantityOnHand),
                ),
              );
            }}
          />
        </FFormGroup>
      </Col>
    </Row>
  );
}
