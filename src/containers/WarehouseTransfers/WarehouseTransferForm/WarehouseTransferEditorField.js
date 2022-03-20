import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import WarehouseTransferFormEntriesTable from './WarehouseTransferFormEntriesTable';
import {
  entriesFieldShouldUpdate,
  defaultWarehouseTransferEntry,
} from './utils';


/**
 * Warehouse transafer editor field.
 */
export default function WarehouseTransferEditorField() {
  const { items } = useWarehouseTransferFormContext();

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
          <WarehouseTransferFormEntriesTable
            entries={value}
            onUpdateData={(entries) => {
              setFieldValue('entries', entries);
            }}
            items={items}
            defaultEntry={defaultWarehouseTransferEntry}
            errors={error}
            sourceWarehouseId={values.from_warehouse_id}
            destinationWarehouseId={values.to_warehouse_id}
          />
        )}
      </FastField>
    </div>
  );
}
