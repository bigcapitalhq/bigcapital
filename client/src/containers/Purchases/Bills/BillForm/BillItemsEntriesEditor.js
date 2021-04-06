import React from 'react';
import classNames from 'classnames';
import { FastField } from 'formik';
import { CLASSES } from 'common/classes';
import { useBillFormContext } from './BillFormProvider';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';

export default function BillFormBody({ defaultBill }) {
  const { items } = useBillFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField name={'entries'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <ItemsEntriesTable
            entries={value}
            onUpdateData={(entries) => {
              setFieldValue('entries', entries);
            }}
            items={items}
            errors={error}
            linesNumber={4}
            currencyCode={values.currency_code}
          />
        )}
      </FastField>
    </div>
  );
}
