import { FormGroup, Intent } from '@blueprintjs/core';
import {
  Field,
  InputGroup,
  NumericInput,
  Checkbox,
  RadioGroup,
  Switch,
  EditableText,
  TextArea,
  HTMLSelect,
} from '@blueprintjs-formik/core';
import { TimezoneSelect } from '@blueprintjs-formik/datetime-v6';
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
import { FDateInput } from './FDateInput';
import { FSelect, BPSelect } from './Select';
import type { FormGroupProps } from '@blueprintjs-formik/core';
import type { FieldProps } from 'formik';

function FFormGroup({ name, fastField, children, ...props }: FormGroupProps) {
  return (
    <Field name={name} fastField={fastField}>
      {({ meta }: FieldProps<unknown>) => {
        const error = meta.touched ? meta.error : undefined;

        return (
          <FormGroup
            labelFor={name}
            intent={error ? Intent.DANGER : Intent.NONE}
            helperText={error || ''}
            {...props}
          >
            {children}
          </FormGroup>
        );
      }}
    </Field>
  );
}

export {
  FFormGroup,
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
  FDateInput,
  HTMLSelect as FHTMLSelect,
  TimezoneSelect as FTimezoneSelect,
  Suggest,
  MultiSelect,
  Select,
  withFormikSelect,
  withFormikMultiSelect,
  withFormikSuggest,
};
