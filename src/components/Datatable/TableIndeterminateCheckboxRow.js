import React from 'react';
import { Checkbox } from '@blueprintjs/core';

export default function TableIndeterminateCheckboxRow({ row }) {
  return (
    <div class="selection-checkbox">
      <Checkbox {...row.getToggleRowSelectedProps()} />
    </div>
  );
}
