import {
  DateInput as BlueprintDateInput,
  DateInputMigrationUtils,
  type DateInputProps,
} from '@blueprintjs/datetime';
import { enUS } from 'date-fns/locale';
import React from 'react';

type DateValueProps = Omit<DateInputProps, 'value' | 'onChange'> & {
  value: Date | null;
  onChange: (date: Date | null, isUserChange: boolean) => void;
};

/** Bridge controls which edit Date objects to Blueprint's ISO value API. */
export function DateInput({ value, onChange, ...props }: DateValueProps) {
  return (
    <BlueprintDateInput
      locale={enUS}
      {...props}
      value={DateInputMigrationUtils.valueAdapter(value, props.timePrecision)}
      onChange={DateInputMigrationUtils.onChangeAdapter(onChange)}
    />
  );
}
