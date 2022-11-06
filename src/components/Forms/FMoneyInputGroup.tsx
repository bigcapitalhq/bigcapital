// @ts-nocheck
import React from 'react';
import { Intent } from '@blueprintjs/core';
import { Field, getIn } from 'formik';
import { CurrencyInput } from './MoneyInputGroup';

const fieldToMoneyInputGroup = ({
  field: { onBlur: onFieldBlur, ...field },
  form: { setFieldValue, touched, errors },
  onBlur,
  ...props
}) => {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    intent: showError ? Intent.DANGER : Intent.NONE,
    onBlurValue:
      onBlur ??
      function (e) {
        onFieldBlur(e ?? field.name);
      },
    ...field,
    onChange: (value) => {
      setFieldValue(field.name, value);
    },
    ...props,
  };
};

function FieldToMoneyInputGroup({ ...props }) {
  return <CurrencyInput {...fieldToMoneyInputGroup(props)} />;
}

export function FMoneyInputGroup({ ...props }) {
  return <Field {...props} component={FieldToMoneyInputGroup} />;
}
