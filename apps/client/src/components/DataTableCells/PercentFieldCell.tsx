// @ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import { FormGroup, Intent } from '@blueprintjs/core';

import { MoneyInputGroup } from '@/components';
import { CellType } from '@/constants';

const PercentFieldCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  payload: { errors, updateData },
}) => {
  const [value, setValue] = useState(initialValue);

  const handleBlurChange = (newValue) => {
    const parsedValue = newValue === '' || newValue === undefined
      ? '' : parseInt(newValue, 10);
    updateData(index, id, parsedValue);
  };

  const handleChange = useCallback((value) => {
    setValue(value);
  }, [setValue]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = errors?.[index]?.[id];

  return (
    <FormGroup intent={error ? Intent.DANGER : null}>
      <MoneyInputGroup
        prefix={'%'}
        value={value}
        onChange={handleChange}
        onBlurValue={handleBlurChange}
      />
    </FormGroup>
  );
};

PercentFieldCell.cellType = CellType.Field;

export default PercentFieldCell;
