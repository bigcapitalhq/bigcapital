import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from '@/common/classes';
import AllocateLandedCostEntriesTable from './AllocateLandedCostEntriesTable';

export default function AllocateLandedCostFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'items'}>
        {({
          form: { setFieldValue, values },
          field: { value },
          meta: { error, touched },
        }) => (
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
