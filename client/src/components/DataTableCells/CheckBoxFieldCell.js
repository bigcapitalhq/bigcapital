import React from 'react';
import classNames from 'classnames';
import { Classes, Checkbox, FormGroup, Intent } from '@blueprintjs/core';

const CheckboxEditableCell = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  payload,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    payload.updateData(index, id, value);
  };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = payload.errors?.[index]?.[id];

  return (
    <FormGroup
      // intent={error ? Intent.DANGER : null}
      className={classNames(Classes.FILL)}
    >
      <Checkbox
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        minimal={true}
        className="ml2"
      />
    </FormGroup>
  );
};

export default CheckboxEditableCell;
