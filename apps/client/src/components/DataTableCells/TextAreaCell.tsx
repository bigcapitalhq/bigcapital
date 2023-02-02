// @ts-nocheck
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Classes, TextArea, FormGroup, Intent } from '@blueprintjs/core';
import { CellType } from '@/constants';

const TextAreaEditableCell = ({
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
      <TextArea
        growVertically={true}
        large={true}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        fill={true}
      />
    </FormGroup>
  );
};

TextAreaEditableCell.cellType = CellType.Field;

export default TextAreaEditableCell;
