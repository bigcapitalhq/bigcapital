import React, {useState, useEffect} from 'react';
import {
  InputGroup
} from '@blueprintjs/core';

const InputEditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  payload,
}) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }
  const onBlur = () => {
    payload.updateData(index, id, value)
  }
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (<InputGroup
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    fill={true} />);
};

export default InputEditableCell;
