import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { decrementQuantity, incrementQuantity } from './utils';
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

export function IncrementAdjustmentFields(): React.ReactElement {
  const incrementFieldRef = useAutofocus<HTMLInputElement>();
  const { values, setFieldValue } =
    useFormikContext<InventoryAdjustmentFormValues>();

  return (
    <Row>
      <Col className={'col--quantity-on-hand'}>
        <FFormGroup
          name={'quantityOnHand'}
          label={intl.get('qty_on_hand')}
          fastField
        >
          <FInputGroup name={'quantityOnHand'} disabled={true} fastField />
        </FFormGroup>
      </Col>

      <Col className={'col--sign'}>
        <span>+</span>
      </Col>

      <Col className={'col--quantity'}>
        <FFormGroup name={'quantity'} label={intl.get('increment')} fastField>
          <FMoneyInputGroup
            name={'quantity'}
            allowDecimals={false}
            allowNegativeValue={true}
            inputRef={(ref: HTMLInputElement | null) => {
              incrementFieldRef.current = ref;
            }}
            onBlurValue={(value: string) => {
              setFieldValue(
                'newQuantity',
                incrementQuantity(
                  toSafeNumber(value),
                  toSafeNumber(values.quantityOnHand),
                ),
              );
            }}
            fastField
          />
        </FFormGroup>
      </Col>

      <Col className={'col--cost'}>
        <FFormGroup name={'cost'} label={intl.get('cost')} fastField>
          <FMoneyInputGroup name={'cost'} fastField />
        </FFormGroup>
      </Col>

      <Col className={'col--sign'}>
        <span>=</span>
      </Col>

      <Col className={'col--quantity-on-hand'}>
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
            fastField
          />
        </FFormGroup>
      </Col>
    </Row>
  );
}
