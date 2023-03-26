// @ts-nocheck
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Classes, InputGroup, FormGroup, Intent } from '@blueprintjs/core';
import { CellType } from '@/constants';

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

  const error = payload.errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(Classes.FILL)}
    >
      <InputGroup
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        fill={true}
      />
    </FormGroup>
  );
};

InputEditableCell.cellType = CellType.Field;

export default InputEditableCell;
