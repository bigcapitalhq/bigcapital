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
        {({ form, field: { value }, meta: { error, touched } }) => (
          <ItemsEntriesTable
            entries={value}
            onUpdateData={(entries) => {
              form.setFieldValue('entries', entries);
            }}
            items={items}
            errors={error}
            linesNumber={4}
          />
        )}
      </FastField>
    </div>
  );
}
