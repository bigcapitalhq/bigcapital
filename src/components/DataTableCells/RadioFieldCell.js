import React from 'react';
import classNames from 'classnames';
import { FormGroup, Intent, Classes, Radio } from '@blueprintjs/core';

export function RadioTableCell({
  row: { index, original },
  column: { id, radioProps },
  cell: { value: initialValue },
  payload,
}) {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    // const newValue = e.target.checked;
    // debugger;
    // setValue(newValue);
    // payload.updateData(index, id, newValue);
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
      <Radio
        value={value}
        label={'Warehouse #1'}
        onChange={onChange}
        checked={initialValue}
        minimal={true}
        {...radioProps}
      />
    </FormGroup>
  );
}
