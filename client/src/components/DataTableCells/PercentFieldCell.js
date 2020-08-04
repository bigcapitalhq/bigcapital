import React, { useCallback, useState, useEffect } from 'react';
import { FormGroup, Intent } from '@blueprintjs/core';
import MoneyInputGroup from 'components/MoneyInputGroup';

const PercentFieldCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  payload: { errors, updateData },
}) => {
  const [value, setValue] = useState(initialValue);

  const onBlur = (e) => {
    updateData(index, id, parseInt(e.target.value, 10));
  };

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);


  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = errors?.[index]?.[id];

  return (
    <FormGroup intent={error ? Intent.DANGER : null}>
      <MoneyInputGroup
        value={value}
        suffix={'%'}
        onChange={onChange}
        inputGroupProps={{
          fill: true,
          onBlur,
        }}
      />
    </FormGroup>
  );
};

export default PercentFieldCell;
