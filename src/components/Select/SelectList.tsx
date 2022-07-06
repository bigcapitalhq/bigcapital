import React from 'react';
import { Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export function SelectList(props) {
  const { buttonLabel, ...rest } = props;

  return (
    <Select {...rest}>
      <Button fill={true}>{buttonLabel}</Button>
    </Select>
  );
}
