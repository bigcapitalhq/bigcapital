// @ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import { FormGroup, Intent } from '@blueprintjs/core';

import { MoneyInputGroup } from '@/components';
import { CLASSES } from '@/constants/classes';
import { CellType } from '@/constants';

// Input form cell renderer.
const MoneyFieldCellRenderer = ({
  row: { index, moneyInputGroupProps = {} },
  column: { id },
  cell: { value: initialValue },
  payload: { errors, updateData },
}) => {
  const [value, setValue] = useState(initialValue);

  const handleFieldChange = useCallback((value) => {
    setValue(value);
  }, [setValue]);

  function isNumeric(data) {
    return (
      !isNaN(parseFloat(data)) && isFinite(data) && data.constructor !== Array
    );
  }

  const handleFieldBlur = () => {
    const updateValue = isNumeric(value) ? parseFloat(value) : value;
    updateData(index, id, updateValue);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={CLASSES.FILL}>
      <MoneyInputGroup
        value={value}
        // prefix={'$'}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        {...moneyInputGroupProps}
      />
    </FormGroup>
  );
};

MoneyFieldCellRenderer.cellType = CellType.Field;

export default MoneyFieldCellRenderer;
