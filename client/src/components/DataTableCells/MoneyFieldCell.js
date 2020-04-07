import React, { useCallback, useState } from 'react';
import MoneyInputGroup from 'components/MoneyInputGroup';

// Input form cell renderer.
const MoneyFieldCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  payload
}) => {
  const [value, setValue] = useState(initialValue);

  const handleFieldChange = useCallback((e, value) => {
    setValue(value);
  }, []);

  function isNumeric(data) {
    return !isNaN(parseFloat(data)) && isFinite(data) && data.constructor !== Array;
  }

  const onBlur = () => {
    const updateValue = isNumeric(value) ? parseFloat(value) : value;
    payload.updateData(index, id, updateValue);
  };

  return (<MoneyInputGroup
    value={value}
    prefix={'$'}
    onChange={handleFieldChange}
    inputGroupProps={{
      fill: true,
      onBlur,
    }} />)
};

export default MoneyFieldCellRenderer;