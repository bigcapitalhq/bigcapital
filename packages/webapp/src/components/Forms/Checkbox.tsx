// @ts-nocheck
import React, { useState } from 'react';
import {
  Checkbox as BPCheckbox,    
} from '@blueprintjs/core';

export default function CheckboxComponent(props: any) {
  const { field, form, ...rest } = props;
  const [value, setValue] = useState(field.value || false);

  const handleChange = () => {
    const checked = !value;
    form.setFieldValue(field.name, checked);
    setValue(checked);
  };

  const handleBlur = () => {
    form.setFieldTouched(field.name);
  };

  const checkboxProps = {
    ...rest,
    onChange: handleChange,
    onBlur: handleBlur,
    checked: value,
  }
  return <BPCheckbox {...checkboxProps} />;
}