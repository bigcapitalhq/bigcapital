import { Checkbox } from '@blueprintjs/core';
import React from 'react';
import type { Row } from 'react-table';
import { CellType } from '@/constants';

interface TableIndeterminateCheckboxRowProps {
  row: Row<any>;
}

type TableIndeterminateCheckboxRowComponent =
  React.FC<TableIndeterminateCheckboxRowProps> & {
    cellType: string;
  };

const TableIndeterminateCheckboxRow: TableIndeterminateCheckboxRowComponent = ({
  row,
}) => {
  const { checked, indeterminate, onChange, title } =
    row.getToggleRowSelectedProps();

  return (
    <div className="selection-checkbox">
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        title={title}
      />
    </div>
  );
};

TableIndeterminateCheckboxRow.cellType = CellType.Field;

export default TableIndeterminateCheckboxRow;
