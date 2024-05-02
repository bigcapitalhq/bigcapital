// @ts-nocheck
import React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { CellType } from '@/constants';
export default function TableIndeterminateCheckboxRow({ row }) {
  return (
    <div className="selection-checkbox">
      <Checkbox {...row.getToggleRowSelectedProps()} />
    </div>
  );
}

TableIndeterminateCheckboxRow.cellType = CellType.Field;
