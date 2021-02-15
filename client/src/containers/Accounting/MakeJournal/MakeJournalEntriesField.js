import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';
import { defaultManualJournal, MIN_LINES_NUMBER } from './utils';

/**
 * Make journal entries field.
 */
export default function MakeJournalEntriesField() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <MakeJournalEntriesTable
            onChange={(entries) => {
              form.setFieldValue('entries', entries);
            }}
            entries={value}
            defaultEntry={defaultManualJournal}
            initialLinesNumber={MIN_LINES_NUMBER}
            error={error}
          />
        )}
      </FastField>
    </div>
  );
}
