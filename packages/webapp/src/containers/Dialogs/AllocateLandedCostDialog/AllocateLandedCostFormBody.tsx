import classNames from 'classnames';
import { FastField } from 'formik';
import React from 'react';
import { AllocateLandedCostEntriesTable } from './AllocateLandedCostEntriesTable';
import type {
  AllocateLandedCostFormEntry,
  AllocateLandedCostFormValues,
} from './types';
import { CLASSES } from '@/constants/classes';

interface ItemsFastFieldRenderProps {
  form: { setFieldValue: (field: string, value: unknown) => void };
  field: { value: AllocateLandedCostFormEntry[] };
  meta: { error?: unknown; touched?: boolean };
}

export function AllocateLandedCostFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'items'}>
        {({
          form: { setFieldValue },
          field: { value },
        }: ItemsFastFieldRenderProps) => (
          <AllocateLandedCostEntriesTable
            entries={value}
            onUpdateData={(newEntries) => {
              setFieldValue('items', newEntries);
            }}
          />
        )}
      </FastField>
    </div>
  );
}

// Re-export to satisfy callers that import the form values type.
export type { AllocateLandedCostFormValues };
