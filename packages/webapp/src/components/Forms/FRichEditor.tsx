import React from 'react';
import { FieldConfig, FieldProps } from 'formik';
import { Field } from '@blueprintjs-formik/core';
import { RichEditor, RichEditorProps } from '../../components/RichEditor';

export interface FRichEditorProps
  extends Omit<FieldConfig, 'children' | 'component' | 'as'>,
    RichEditorProps {
  name: string;
  value?: string;
}

interface FieldToRichEditorProps
  extends FieldProps,
    Omit<RichEditorProps, 'form'> {}

/**
 * Transformes the field props to `RichEditor` props.
 * @param {FieldToRichEditorProps}
 * @returns {HTMLSelectProps}
 */
function fieldToRichEditor({
  field: { onBlur: onFieldBlur, ...field },
  form: { touched, errors, ...form },
  ...props
}: FieldToRichEditorProps): RichEditorProps {
  return {
    ...field,
    ...props,
    onChange: (value: string) => {
      form.setFieldValue(field.name, value);
    },
  };
}

/**
 * Transformes field props to `RichEditor` props.
 * @param {FieldToRichEditorProps}
 * @returns {JSX.Element}
 */
function FieldToRichEditor({ ...props }: FieldToRichEditorProps): JSX.Element {
  return <RichEditor {...fieldToRichEditor(props)} />;
}

/**
 * Rich editor wrapper to bind with Formik.
 * @param {FRichEditorProps} props -
 * @returns {JSX.Element}
 */
export function FRichEditor({ ...props }: FRichEditorProps): JSX.Element {
  return <Field {...props} component={FieldToRichEditor} />;
}
