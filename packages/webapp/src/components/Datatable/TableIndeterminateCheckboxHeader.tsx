import { Checkbox } from '@blueprintjs/core';
import React from 'react';

interface TableIndeterminateCheckboxHeaderProps {
  getToggleAllRowsSelectedProps: () => Record<string, any>;
}

export default function TableIndeterminateCheckboxHeader({
  getToggleAllRowsSelectedProps,
}: TableIndeterminateCheckboxHeaderProps) {
  return (
    <div>
      <Checkbox {...getToggleAllRowsSelectedProps()} />
    </div>
  );
}
