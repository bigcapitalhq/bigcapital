import React from 'react';
import { Checkbox } from '@blueprintjs/core';

export default function TableIndeterminateCheckboxRow({ row }) {
  return (
    <div>
      <Checkbox {...row.getToggleRowSelectedProps()} />
    </div>
  );
}
