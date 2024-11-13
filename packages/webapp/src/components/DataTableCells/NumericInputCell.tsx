import React, { useState, useEffect } from 'react';
import { FormGroup, NumericInput, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { CellType } from '@/constants';
import { CLASSES } from '@/constants/classes';

/**
 * Numeric input table cell.
 */
export default function NumericInputCell({
  row: { index },
  column: { id },
  cell: { value: controlledInputValue },
  payload,
}: any) {
  const [valueAsNumber, setValueAsNumber] = useState<number | null>(
    controlledInputValue || null,
  );
  const handleInputValueChange = (
    valueAsNumber: number,
    valueAsString: string,
  ) => {
    setValueAsNumber(valueAsNumber);
  };
  const handleInputBlur = () => {
    payload.updateData(index, id, valueAsNumber);
  };

  useEffect(() => {
    setValueAsNumber(controlledInputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledInputValue]);

  const error = payload.errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : undefined}
      className={classNames(CLASSES.FILL)}
    >
      <NumericInput
        asyncControl
        value={controlledInputValue}
        onValueChange={handleInputValueChange}
        onBlur={handleInputBlur}
        buttonPosition={'none'}
        fill
      />
    </FormGroup>
  );
}

NumericInputCell.cellType = CellType.Field;
