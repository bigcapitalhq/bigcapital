import React from 'react';
import { getIn, FieldConfig, FieldProps } from 'formik';
import { Intent } from '@blueprintjs/core';
import { Field } from '@blueprintjs-formik/core';
import { ColorInput, ColorInputProps } from './ColorInput';

interface ColorInputInputGroupProps
  extends Omit<FieldConfig, 'children' | 'component' | 'as' | 'value'>,
    ColorInputProps {}

export interface ColorInputToInputProps
  extends Omit<FieldProps, 'onChange'>,
    ColorInputProps {}

/**
 * Transforms field props to input group props for ColorInput.
 * @param {ColorInputToInputProps}
 * @returns {ColorInputProps}
 */
function fieldToColorInputInputGroup({
  field: { onBlur: onFieldBlur, onChange: onFieldChange, value, ...field },
  form: { touched, errors, setFieldValue },
  onChange,
  ...props
}: ColorInputToInputProps): ColorInputProps {
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
 * Transforms field props to input group props for ColorInput.
 * @param {ColorInputToInputProps} props -
 * @returns {JSX.Element}
 */
function ColorInputToInputGroup({
  ...props
}: ColorInputToInputProps): JSX.Element {
  return <ColorInput {...fieldToColorInputInputGroup(props)} />;
}

/**
 * Input group Blueprint component binded with Formik for ColorInput.
 * @param {ColorInputInputGroupProps}
 * @returns {JSX.Element}
 */
export function FColorInput({
  ...props
}: ColorInputInputGroupProps): JSX.Element {
  return <Field {...props} component={ColorInputToInputGroup} />;
}
