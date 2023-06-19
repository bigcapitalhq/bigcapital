// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Classes, ControlGroup } from '@blueprintjs/core';
import { FFormGroup, FInputGroup, Choose } from '@/components';
import { useFormikContext } from 'formik';

function PercentageFormField() {
  return (
    <FFormGroup
      label={intl.get('estimated_expenses.dialog.percentage')}
      name={'percentage'}
    >
      <FInputGroup name="percentage" />
    </FFormGroup>
  );
}

function CustomPriceField() {
  return (
    <ControlGroup className={Classes.FILL}>
      <FFormGroup
        name={'unitPrice'}
        label={intl.get('estimated_expenses.dialog.unit_price')}
      >
        <FInputGroup name="unitPrice" />
      </FFormGroup>
      <FFormGroup
        name={'unitPrice'}
        label={intl.get('estimated_expenses.dialog.total')}
      >
        <FInputGroup name="total" />
      </FFormGroup>
    </ControlGroup>
  );
}

/**
 * estimate expense form charge fields.
 * @returns
 */
export default function EstimatedExpenseFormChargeFields() {
  const { values } = useFormikContext();
  return (
    <Choose>
      <Choose.When condition={values.charge === 'markup'}>
        <PercentageFormField />
      </Choose.When>
      <Choose.When condition={values.charge === 'custom_price'}>
        <CustomPriceField />
      </Choose.When>
    </Choose>
  );
}
