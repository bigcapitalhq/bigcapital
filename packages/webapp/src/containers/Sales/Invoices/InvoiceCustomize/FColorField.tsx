import React from 'react';
import { getIn, FieldConfig, FieldProps } from 'formik';
import { Intent } from '@blueprintjs/core';
import { Field } from '@blueprintjs-formik/core';
import { ColorField, ColorFieldProps } from './ColorField';

interface ColorFieldInputGroupProps
  extends Omit<FieldConfig, 'children' | 'component' | 'as' | 'value'>,
    ColorFieldProps {}

export interface ColorFieldToInputProps
  extends Omit<FieldProps, 'onChange'>,
    ColorFieldProps {}

/**
 * Transforms field props to input group props for ColorField.
 * @param {ColorFieldToInputProps}
 * @returns {ColorFieldProps}
 */
function fieldToColorFieldInputGroup({
  field: { onBlur: onFieldBlur, onChange: onFieldChange, value, ...field },
  form: { touched, errors, setFieldValue },
  onChange,
  ...props
}: ColorFieldToInputProps): ColorFieldProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    inputProps: {
      intent: showError ? Intent.DANGER : Intent.NONE,
    },
    value,
    onChange:
      onChange ??
      function (value: string) {
        setFieldValue(field.name, value);
      },
    ...field,
    ...props,
  };
}

/**
 * Transforms field props to input group props for ColorField.
 * @param {ColorFieldToInputProps} props -
 * @returns {JSX.Element}
 */
function ColorFieldToInputGroup({
  ...props
}: ColorFieldToInputProps): JSX.Element {
  return <ColorField {...fieldToColorFieldInputGroup(props)} />;
}

/**
 * Input group Blueprint component binded with Formik for ColorField.
 * @param {ColorFieldInputGroupProps}
 * @returns {JSX.Element}
 */
export function FColorInput({
  ...props
}: ColorFieldInputGroupProps): JSX.Element {
  return <Field {...props} component={ColorFieldToInputGroup} />;
}
