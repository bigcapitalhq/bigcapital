import { Intent } from '@blueprintjs/core';
import { Field, FastField, getIn } from 'formik';
import React from 'react';
import { CurrencyInput } from './MoneyInputGroup';

interface FieldProps {
  field: {
    name: string;
    onBlur?: (e: unknown) => void;
    [key: string]: unknown;
  };
  form: {
    setFieldValue: (field: string, value: unknown) => void;
    touched: Record<string, unknown>;
    errors: Record<string, unknown>;
  };
  onBlur?: (e: unknown) => void;
  [key: string]: unknown;
}

const fieldToMoneyInputGroup = ({
  field: { onBlur: onFieldBlur, ...field },
  form: { setFieldValue, touched, errors },
  onBlur,
  ...props
}: FieldProps) => {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    intent: showError ? Intent.DANGER : Intent.NONE,
    onBlurValue:
      onBlur ??
      function (e?: unknown) {
        onFieldBlur?.(e ?? field.name);
      },
    ...field,
    onChange: (value: unknown) => {
      setFieldValue(field.name, value);
    },
    ...props,
  };
};

function FieldToMoneyInputGroup(props: FieldProps) {
  return <CurrencyInput {...fieldToMoneyInputGroup(props)} />;
}

interface FMoneyInputGroupProps {
  fastField?: boolean;
  name: string;
  [key: string]: unknown;
}

export function FMoneyInputGroup({
  fastField,
  ...props
}: FMoneyInputGroupProps) {
  const FieldComponent = fastField ? FastField : Field;
  return <FieldComponent {...props} component={FieldToMoneyInputGroup} />;
}
