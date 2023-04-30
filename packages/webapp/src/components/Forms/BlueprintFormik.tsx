// @ts-nocheck
import React from 'react';
import {
  FormGroup,
  InputGroup,
  NumericInput,
  Checkbox,
  RadioGroup,
  Switch,
  EditableText,
  TextArea,
} from '@blueprintjs-formik/core';
import { Button } from '@blueprintjs/core';
import { Select, MultiSelect } from '@blueprintjs-formik/select';
import { DateInput } from '@blueprintjs-formik/datetime';

function FSelect({ ...props }) {
  const input = ({ activeItem, text, label, value }) => {
    return (
      <Button
        text={text || props.placeholder || 'Select an item ...'}
        rightIcon="double-caret-vertical"
        {...props.buttonProps}
      />
    );
  };
  return <Select input={input} {...props} />;
}

export {
  FormGroup as FFormGroup,
  InputGroup as FInputGroup,
  NumericInput as FNumericInput,
  Checkbox as FCheckbox,
  RadioGroup as FRadioGroup,
  Switch as FSwitch,
  FSelect,
  MultiSelect as FMultiSelect,
  EditableText as FEditableText,
  TextArea as FTextArea,
  DateInput as FDateInput,
};
