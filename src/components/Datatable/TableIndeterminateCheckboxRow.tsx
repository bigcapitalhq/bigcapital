import React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { CellType } from 'common';
export default function TableIndeterminateCheckboxRow({ row }) {
  return (
    <div class="selection-checkbox">
      <Checkbox {...row.getToggleRowSelectedProps()} />
    </div>
  );
}

TableIndeterminateCheckboxRow.cellType = CellType.Field;
