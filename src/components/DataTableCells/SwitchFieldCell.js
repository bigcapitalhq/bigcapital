import React from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import { Classes, Switch, FormGroup, Intent } from '@blueprintjs/core';

const SwitchEditableCell = ({
  row: { index, original },
  column: { id, switchProps },
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

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(Classes.FILL)}
    >
      <Switch
        value={value}
        // onChange={onChange}
        checked={initialValue}
        minimal={true}
        className="ml2"
        {...switchProps}
      />
    </FormGroup>
  );
};
export default SwitchEditableCell;
