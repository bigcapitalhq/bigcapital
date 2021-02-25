import React, { useCallback } from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';
import { useInvoiceFormContext } from './InvoiceFormProvider';

/**
 * Invoice items entries editor field.
 */
export default function InvoiceItemsEntriesEditorField() {
  const { items } = useInvoiceFormContext();

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
