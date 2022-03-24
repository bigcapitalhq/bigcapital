import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import MakeJournalEntriesTable from './MakeJournalEntriesTable';
import { entriesFieldShouldUpdate, defaultEntry, MIN_LINES_NUMBER } from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';

/**
 * Make journal entries field.
 */
export default function MakeJournalEntriesField() {
  const { accounts, contacts ,branches } = useMakeJournalFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField
        name={'entries'}
        contacts={contacts}
        accounts={accounts}
        branches={branches}
        shouldUpdate={entriesFieldShouldUpdate}
      >
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <MakeJournalEntriesTable
            onChange={(entries) => {
              setFieldValue('entries', entries);
            }}
            entries={value}
            defaultEntry={defaultEntry}
            initialLinesNumber={MIN_LINES_NUMBER}
            error={error}
            currencyCode={values.currency_code}
          />
        )}
      </FastField>
    </div>
  );
}
