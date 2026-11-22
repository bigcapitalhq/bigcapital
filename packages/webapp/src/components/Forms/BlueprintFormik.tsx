import {
  TimezoneSelect,
  type TimezoneSelectProps,
} from '@blueprintjs/datetime';
import {
  Field,
  type FieldBaseProps,
  FormGroup,
  InputGroup,
  NumericInput,
  Checkbox,
  RadioGroup,
  Switch,
  EditableText,
  TextArea,
  HTMLSelect,
} from '@blueprintjs-formik/core';
import {
  MultiSelect,
  Suggest,
  Select,
  type SelectOptionProps,
  type WithFormikSuggestProps,
  type WithFormikMultiSelectProps,
  withFormikMultiSelect,
  withFormikSuggest,
  withFormikSelect,
} from '@blueprintjs-formik/select';
import { useField, type FieldProps } from 'formik';
import React from 'react';
import { FDateInput } from './FDateInput';
import { FSelect, BPSelect } from './Select';
import type { InputGroupProps } from '@blueprintjs/core';

export {
  FormGroup as FFormGroup,
  NumericInput as FNumericInput,
  Checkbox as FCheckbox,
  RadioGroup as FRadioGroup,
  Switch as FSwitch,
  FSelect,
  BPSelect,
  EditableText as FEditableText,
  TextArea as FTextArea,
  FDateInput,
  HTMLSelect as FHTMLSelect,
  Suggest,
  MultiSelect,
  Select,
  withFormikSelect,
  withFormikMultiSelect,
  withFormikSuggest,
};

export function FTimezoneSelect({
  name,
  buttonProps,
  ...props
}: Omit<TimezoneSelectProps, 'value' | 'onChange'> & { name: string }) {
  const [field, meta, helpers] = useField<string>(name);
  return (
    <TimezoneSelect
      {...props}
      value={field.value || ''}
      onChange={(timezone) => helpers.setValue(timezone)}
      buttonProps={{
        intent: meta.touched && meta.error ? 'danger' : 'none',
        ...buttonProps,
      }}
    />
  );
}

// The published Formik binding types reference Blueprint's removed InputGroupProps2 alias.
type FormInputGroupProps = Omit<
  FieldBaseProps,
  'children' | 'component' | 'as'
> &
  Omit<InputGroupProps, 'value' | 'name'>;
export const FInputGroup: React.FC<FormInputGroupProps> = InputGroup;

// Render the picker as a stable child so validating another field on blur
// doesn't remount it and dismiss the popover that the user just opened.
export function FSuggest<T extends SelectOptionProps>(
  props: WithFormikSuggestProps<T>,
) {
  const { name, fastField, shouldUpdate, ...suggestProps } = props;
  return (
    <Field
      {...suggestProps}
      name={name}
      fastField={fastField}
      shouldUpdate={shouldUpdate}
    >
      {({ field, form }: FieldProps) => (
        <Suggest<T>
          selectedValue={field.value}
          onValueChange={(value) => form.setFieldValue(name, value)}
          {...suggestProps}
        />
      )}
    </Field>
  );
}

export function FMultiSelect<T extends SelectOptionProps>(
  props: WithFormikMultiSelectProps<T>,
) {
  const { name, fastField, shouldUpdate, tagInputProps, ...selectProps } =
    props;
  return (
    <Field
      {...selectProps}
      name={name}
      fastField={fastField}
      shouldUpdate={shouldUpdate}
    >
      {({ field, form }: FieldProps) => (
        <MultiSelect<T>
          selectedValues={field.value}
          onValuesChange={(values) => form.setFieldValue(name, values)}
          tagInputProps={{
            ...tagInputProps,
            inputProps: { id: name, ...tagInputProps?.inputProps },
          }}
          {...selectProps}
        />
      )}
    </Field>
  );
}
