// @ts-nocheck
import React from 'react';
import { Checkbox } from '@blueprintjs/core';

export default function TableIndeterminateCheckboxHeader({
  getToggleAllRowsSelectedProps,
}) {
  return (
    <div>
      <Checkbox  {...getToggleAllRowsSelectedProps()} />
    </div>
  );
}
