// @ts-nocheck
import { useFormikContext } from 'formik';
import React from 'react';
import { FInputGroup } from '@/components';

export function FInputGroupComponent({ toField, ...props }) {
  const { values, setFieldValue } = useFormikContext();
  const { expenseQuantity, expenseUnitPrice } = values;
  const total = expenseQuantity * expenseUnitPrice;

  const handleBlur = () => {
    setFieldValue(toField, total);
  };

  const inputGroupProps = {
    onBlur: handleBlur,
    ...props,
  };
  return <FInputGroup {...inputGroupProps} />;
}
