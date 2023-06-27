// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import { Classes, Checkbox, FormGroup, Intent } from '@blueprintjs/core';
import { CellType } from '@/constants';

const CheckboxEditableCell = ({
  row: { index, original },
  column: { id, disabledAccessor, checkboxProps },
  cell: { value: initialValue },
  payload,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    const newValue = e.target.checked;

    setValue(newValue);
    payload.updateData(index, id, newValue);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = payload.errors?.[index]?.[id];

  // Determines whether the checkbox is disabled.
  const disabled = disabledAccessor ? get(original, disabledAccessor) : false;

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(Classes.FILL)}
    >
      <Checkbox
        value={value}
        onChange={onChange}
        checked={initialValue}
        disabled={disabled}
        minimal={true}
        className="ml2"
        {...checkboxProps}
      />
    </FormGroup>
  );
};

CheckboxEditableCell.cellType = CellType.Field;

export default CheckboxEditableCell;
