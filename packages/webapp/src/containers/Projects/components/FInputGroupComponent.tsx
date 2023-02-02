// @ts-nocheck
import React from 'react';
import { FInputGroup } from '@/components';
import { useFormikContext } from 'formik';

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
