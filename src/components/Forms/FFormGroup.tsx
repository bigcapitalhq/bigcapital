import React from 'react';
import { FieldMetaProps, FieldInputProps, useField } from 'formik';
import {
  FormGroup as PBFormGroup,
  Intent,
  FormGroupProps as PBFormGroupProps,
} from '@blueprintjs/core';

export interface FormGroupProps extends PBFormGroupProps {
  name: string;
  children: React.ReactElement;
}

/**
 * Transformes field props to form group.
 * @param   {Omit<FormGroupProps, "children">} props
 * @param   {FieldInputProps<any>} field
 * @param   {FieldMetaProps<any>} meta
 * @returns {PBFormGroupProps}
 */
const fieldToFormGroup = (
  props: Omit<FormGroupProps, 'children'>,
  field: FieldInputProps<any>,
  meta: FieldMetaProps<any>
): PBFormGroupProps => {
  const showError = meta.touched && meta.error;

  return {
    intent: showError ? Intent.DANGER : Intent.NONE,
    helperText: showError ? meta.error : '',
    ...props,
  };
};

/**
 * Form group.
 * @param   {FormGroupProps}
 * @returns {React.JSX}
 */
export function FFormGroup({ children, ...props }: FormGroupProps): JSX.Element {
  const [field, meta] = useField(props.name);

  return (
    <PBFormGroup
      {...fieldToFormGroup(props, field, meta)}
      children={children}
    />
  );
}