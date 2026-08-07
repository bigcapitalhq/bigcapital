// @ts-nocheck
import { Classes, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { FFormGroup, FInputGroup, Choose } from '@/components';

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

function CustomPirceField() {
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
export function ExpenseFormChargeFields() {
  const { values } = useFormikContext();

  return (
    <Choose>
      <Choose.When condition={values.expenseCharge === 'markup'}>
        <PercentageFormField />
      </Choose.When>
      <Choose.When condition={values.expenseCharge === 'custom_pirce'}>
        <CustomPirceField />
      </Choose.When>
    </Choose>
  );
}
