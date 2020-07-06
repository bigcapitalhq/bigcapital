import React, { useCallback, useState, useEffect } from 'react';
import { FormGroup, Intent } from '@blueprintjs/core';
import MoneyInputGroup from 'components/MoneyInputGroup';

// Input form cell renderer.
const MoneyFieldCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  payload: { errors, updateData },
}) => {
  const [value, setValue] = useState(initialValue);

  const handleFieldChange = useCallback((e, value) => {
    setValue(value);
  }, []);

  function isNumeric(data) {
    return (
      !isNaN(parseFloat(data)) && isFinite(data) && data.constructor !== Array
    );
  }

  const onBlur = () => {
    const updateValue = isNumeric(value) ? parseFloat(value) : value;
    updateData(index, id, updateValue);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}>
      <MoneyInputGroup
        value={value}
        prefix={'$'}
        onChange={handleFieldChange}
        inputGroupProps={{
          fill: true,
          onBlur,
        }}
      />
    </FormGroup>
  );
};

export default MoneyFieldCellRenderer;
