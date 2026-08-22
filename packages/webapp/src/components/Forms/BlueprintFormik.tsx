import {
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
import { DateInput, TimezoneSelect } from '@blueprintjs-formik/datetime';
import {
  MultiSelect,
  Suggest,
  Select,
  FormikMultiSelect,
  FormikSuggest,
  withFormikMultiSelect,
  withFormikSuggest,
  withFormikSelect,
} from '@blueprintjs-formik/select';
import React from 'react';
import { FSelect, BPSelect } from './Select';
import type { DateInputProps } from '@blueprintjs-formik/datetime';
import { useDateFormatter } from '@/hooks';

/**
 * Date input formik field that displays and parses dates according to the
 * organization's configured date format by default. Explicitly provided
 * `formatDate`, `parseDate` or `placeholder` props override the defaults.
 */
type DateInputFieldProps = Partial<
  Pick<DateInputProps, 'formatDate' | 'parseDate' | 'placeholder'>
> &
  Omit<DateInputProps, 'formatDate' | 'parseDate' | 'placeholder'>;

function DateInputField(props: DateInputFieldProps) {
  const { formatDate, parseDate, placeholder } = useDateFormatter();
  const { inputProps, ...rest } = props;

  return (
    <DateInput
      formatDate={formatDate}
      parseDate={parseDate}
      placeholder={placeholder}
      inputProps={{ placeholder, ...inputProps }}
      {...rest}
    />
  );
}

export {
  FormGroup as FFormGroup,
  InputGroup as FInputGroup,
  NumericInput as FNumericInput,
  Checkbox as FCheckbox,
  RadioGroup as FRadioGroup,
  Switch as FSwitch,
  FSelect,
  BPSelect,
  FormikMultiSelect as FMultiSelect,
  EditableText as FEditableText,
  FormikSuggest as FSuggest,
  TextArea as FTextArea,
  DateInputField as FDateInput,
  HTMLSelect as FHTMLSelect,
  TimezoneSelect as FTimezoneSelect,
  Suggest,
  MultiSelect,
  Select,
  withFormikSelect,
  withFormikMultiSelect,
  withFormikSuggest,
};
