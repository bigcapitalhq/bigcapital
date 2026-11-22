import { DateInput, type DateInputProps } from '@blueprintjs/datetime';
import { enUS } from 'date-fns/locale';
import { Field, FastField, type FieldProps } from 'formik';
import moment from 'moment';
import React from 'react';
import type { FieldBaseProps } from '@blueprintjs-formik/core';

type FormDateInputProps = Omit<DateInputProps, 'value' | 'onChange'> &
  Pick<FieldBaseProps, 'name' | 'fastField' | 'shouldUpdate'>;

/** Store date-only values as local calendar days in every browser timezone. */
export function FDateInput({
  name,
  fastField,
  shouldUpdate,
  inputProps,
  ...props
}: FormDateInputProps) {
  const FormField = fastField ? FastField : Field;
  return (
    <FormField name={name} shouldUpdate={shouldUpdate} disabled={props.disabled}>
      {({ field, form, meta }: FieldProps<string | Date | null>) => (
        <DateInput
          locale={enUS}
          {...props}
          value={field.value ? moment(field.value).format('YYYY-MM-DD') : null}
          onChange={(date) => form.setFieldValue(name, date ?? '')}
          inputProps={{
            id: name,
            intent: meta.touched && meta.error ? 'danger' : 'none',
            ...inputProps,
          }}
        />
      )}
    </FormField>
  );
}
