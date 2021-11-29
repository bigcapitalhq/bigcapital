import React from 'react';
import classNames from 'classnames';
import { FastField } from 'formik';
import { CLASSES } from 'common/classes';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';
import { entriesFieldShouldUpdate } from './utils';
import { ITEM_TYPE } from 'containers/Entries/utils';

export default function VendorCreditNoteItemsEntriesEditor() {
  const { items } = useVendorCreditNoteFormContext();
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField
        name={'entries'}
        items={items}
        shouldUpdate={entriesFieldShouldUpdate}
      >
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
