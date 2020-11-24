import React, { useState } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Alert, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import ItemsEntriesTable from './ItemsEntriesTable';
import { orderingLinesIndexes, repeatValue } from 'utils';

export default function EditableItemsEntriesTable({
  defaultEntry,
  minLinesNumber = 2,
  linesNumber = 5,

  filterSellableItems = false,
  filterPurchasableItems = false,
}) {
  const { setFieldValue, values } = useFormikContext();
  const [clearLinesAlert, setClearLinesAlert] = useState(false);

  const handleClickAddNewRow = () => {
    setFieldValue(
      'entries',
      orderingLinesIndexes([...values.entries, defaultEntry]),
    );
  };

  const handleClearAllLines = () => {
    setClearLinesAlert(true);
  };

  const handleClickRemoveLine = (rowIndex) => {
    if (values.entries.length <= minLinesNumber) {
      return;
    }
    const removeIndex = parseInt(rowIndex, 10);
    const newRows = values.entries.filter((row, index) => index !== removeIndex);
    setFieldValue(
      'entries',
      orderingLinesIndexes(newRows),
    );
  };

  const handleConfirmClearLines = () => {
    setFieldValue(
      'entries',
      orderingLinesIndexes([...repeatValue(defaultEntry, linesNumber)]),
    );
    setClearLinesAlert(false);
  };

  const handleCancelClearLines = () => {
    setClearLinesAlert(false);
  };

  return (
    <>
      <FastField name={'entries'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <ItemsEntriesTable
            onUpdateData={(entries) => {
              form.setFieldValue('entries', entries);
            }}
            entries={value}
            errors={error}
            filterPurchasableItems={filterPurchasableItems}
            filterSellableItems={filterSellableItems}
            onClickAddNewRow={handleClickAddNewRow}
            onClickClearAllLines={handleClearAllLines}
            onClickRemoveRow={handleClickRemoveLine}
          />
        )}
      </FastField>

      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'ok'} />}
        intent={Intent.WARNING}
        isOpen={clearLinesAlert}
        onCancel={handleCancelClearLines}
        onConfirm={handleConfirmClearLines}
      >
        <p>
          Clearing the table lines will delete all entries were applied, Is this
          okay?
        </p>
      </Alert>
    </>
  );
}
