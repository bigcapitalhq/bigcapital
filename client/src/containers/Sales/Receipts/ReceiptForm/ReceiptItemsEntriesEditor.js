import React from 'react';
import classNames from 'classnames';
import { FastField } from 'formik';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';
import { CLASSES } from 'common/classes';
import { useReceiptFormContext } from './ReceiptFormProvider';

export default function ReceiptItemsEntriesEditor({ defaultReceipt }) {
  const { items } = useReceiptFormContext();

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
