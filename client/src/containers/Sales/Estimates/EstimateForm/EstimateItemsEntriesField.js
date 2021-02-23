import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form items entries editor.
 */
export default function EstimateFormItemsEntriesField() {
  const { items } = useEstimateFormContext();

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
