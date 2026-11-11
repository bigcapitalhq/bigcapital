import classNames from 'classnames';
import { FastField, type FieldProps } from 'formik';
import React from 'react';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import {
  defaultRecurringJournalEntry,
  type RecurringJournalEntry,
  type RecurringJournalFormValues,
} from './utils';
import { CLASSES } from '@/constants/classes';
import { MakeJournalEntriesTable } from '@/containers/Accounting/MakeJournal/MakeJournalEntriesTable';
import {
  entriesFieldShouldUpdate,
  MIN_LINES_NUMBER,
} from '@/containers/Accounting/MakeJournal/utils';

export function RecurringJournalEntriesField() {
  const { accounts, contacts, branches, trackingCategories, recurringJournal } =
    useRecurringJournalFormContext();

  const usedCategoryIds = React.useMemo<Set<number>>(() => {
    return new Set<number>(
      (recurringJournal?.entries ?? []).flatMap((entry: any) =>
        (entry.trackingCategories ?? []).map((assignment: any) =>
          Number(assignment.categoryId),
        ),
      ),
    );
  }, [recurringJournal]);

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
          meta: { error },
        }: FieldProps<RecurringJournalEntry[], RecurringJournalFormValues>) => (
          <MakeJournalEntriesTable
            onChange={(entries) => {
              setFieldValue('entries', entries);
            }}
            entries={value ?? []}
            defaultEntry={defaultRecurringJournalEntry}
            initialLinesNumber={MIN_LINES_NUMBER}
            error={error}
            currencyCode={values.currencyCode}
            accounts={accounts}
            contacts={contacts}
            branches={branches}
            trackingCategories={trackingCategories}
            usedCategoryIds={usedCategoryIds}
          />
        )}
      </FastField>
    </div>
  );
}
