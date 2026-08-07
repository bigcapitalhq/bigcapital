import classNames from 'classnames';
import { FastField, type FieldProps } from 'formik';
import { MakeJournalEntriesTable } from './MakeJournalEntriesTable';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import {
  entriesFieldShouldUpdate,
  defaultEntry,
  MIN_LINES_NUMBER,
  type MakeJournalEntry,
  type MakeJournalFormValues,
} from './utils';
import { CLASSES } from '@/constants/classes';

export function MakeJournalEntriesField() {
  const { accounts, contacts, branches, projects } =
    useMakeJournalFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField
        name={'entries'}
        contacts={contacts}
        accounts={accounts}
        branches={branches}
        projects={projects}
        shouldUpdate={entriesFieldShouldUpdate}
      >
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error },
        }: FieldProps<MakeJournalEntry[], MakeJournalFormValues>) => (
          <MakeJournalEntriesTable
            onChange={(entries) => {
              setFieldValue('entries', entries);
            }}
            entries={value ?? []}
            defaultEntry={defaultEntry}
            initialLinesNumber={MIN_LINES_NUMBER}
            error={error}
            currencyCode={values.currencyCode}
          />
        )}
      </FastField>
    </div>
  );
}
