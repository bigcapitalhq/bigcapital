// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Classes, ControlGroup } from '@blueprintjs/core';
import { FFormGroup, FInputGroup, Choose } from '@/components';
import { useFormikContext } from 'formik';

function PercentageFormField() {
  return (
    <FFormGroup
      label={intl.get('expenses.dialog.percentage')}
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
        name={'expenseUnitPrice'}
        label={intl.get('expenses.dialog.unit_price')}
      >
        <FInputGroup name="expenseUnitPrice" />
      </FFormGroup>
      <FFormGroup
        name={'expenseTotal'}
        label={intl.get('expenses.dialog.total')}
      >
        <FInputGroup name="expenseTotal" />
      </FFormGroup>
    </ControlGroup>
  );
}

/**
 * Expense form charge fields.
 * @returns
 */
export default function ExpenseFormChargeFields() {
  const { values } = useFormikContext();

  return (
    <Choose>
      <Choose.When condition={values.expenseCharge === 'markup'}>
        <PercentageFormField />
      </Choose.When>
      <Choose.When condition={values.expenseCharge === 'custom_price'}>
        <CustomPriceField />
      </Choose.When>
    </Choose>
  );
}
