import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Classes, InputGroup, FormGroup } from '@blueprintjs/core';

const InputEditableCell = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  payload,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    payload.updateData(index, id, value);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <FormGroup>
      <InputGroup
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        fill={true}
      />
    </FormGroup>
  );
};

export default InputEditableCell;
