import {
  DateInput,
  type DateInputProps,
} from '@blueprintjs-formik/datetime-v6';
import { enUS } from 'date-fns/locale';
import React from 'react';

export function FDateInput(props: DateInputProps) {
  return <DateInput locale={enUS} {...props} />;
}
