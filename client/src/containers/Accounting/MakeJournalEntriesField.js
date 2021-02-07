import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';
import { orderingLinesIndexes, repeatValue } from 'utils';

export default function MakeJournalEntriesField({
  defaultRow,
  linesNumber = 4,
}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <MakeJournalEntriesTable
            onChange={(entries) => {
              form.setFieldValue('entries', entries);
            }}
            entries={value}
            error={error}
            onClickAddNewRow={() => {
              form.setFieldValue('entries', [...value, defaultRow]);
            }}
            onClickClearAllLines={() => {
              form.setFieldValue(
                'entries', 
                orderingLinesIndexes([...repeatValue(defaultRow, linesNumber)])
              );
            }}
          />
        )}
      </FastField>
    </div>
  );
}
