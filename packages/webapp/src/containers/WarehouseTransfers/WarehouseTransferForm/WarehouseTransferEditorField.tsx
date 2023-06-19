// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import WarehouseTransferFormEntriesTable from './WarehouseTransferFormEntriesTable';
import {
  entriesFieldShouldUpdate,
  defaultWarehouseTransferEntry,
  useWatchItemsCostSetCostEntries
} from './utils';

/**
 * Warehouse transfer editor field.
 */
export default function WarehouseTransferEditorField() {
  const { items } = useWarehouseTransferFormContext();

  // Watches inventory items cost and sets cost to form entries.
  useWatchItemsCostSetCostEntries();

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
