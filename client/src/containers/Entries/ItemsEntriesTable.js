import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import ItemsEntriesDeleteAlert from 'containers/Alerts/ItemsEntries/ItemsEntriesDeleteAlert';
import withAlertActions from 'containers/Alert/withAlertActions';

import { CLASSES } from 'common/classes';
import { DataTableEditable } from 'components';

import { useEditableItemsEntriesColumns } from './components';
import {
  saveInvoke,
  updateTableRow,
  repeatValue,
  removeRowsByIndex,
  compose,
} from 'utils';
import { updateItemsEntriesTotal } from './utils';

/**
 * Items entries table.
 */
function ItemsEntriesTable({
  // #withAlertActions
  openAlert,

  // #ownProps
  items,
  entries,
  initialEntries,
  defaultEntry,
  errors,
  onUpdateData,
  linesNumber,
}) {
  const [rows, setRows] = React.useState(initialEntries);

  // Allows to observes `entries` to make table rows outside controlled.
  React.useEffect(() => {
    if (entries && entries !== rows) {
      setRows(entries);
    }
  }, [entries, rows]);

  // Editiable items entries columns.
  const columns = useEditableItemsEntriesColumns();

  // Handles the editor data update.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(
        updateItemsEntriesTotal,
        updateTableRow(rowIndex, columnId, value),
      )(entries);

      setRows(newRows);
      onUpdateData(newRows);
    },
    [entries, onUpdateData],
  );

  // Handle table rows removing by index.
  const handleRemoveRow = (rowIndex) => {
    const newRows = removeRowsByIndex(rows, rowIndex);
    setRows(newRows);
    saveInvoke(onUpdateData, newRows);
  };

  // Handle table rows adding a new row.
  const onClickNewRow = (event) => {
    const newRows = [...rows, defaultEntry];
    setRows(newRows);
    saveInvoke(onUpdateData, newRows);
  };

  // Handle table clearing all rows.
  const handleClickClearAllLines = (event) => {
    openAlert('items-entries-clear-lines');
  };

  /**
   * Handle alert confirm of clear all lines.
   */
  const handleClearLinesAlertConfirm = () => {
    const newRows = repeatValue(defaultEntry, linesNumber);
    setRows(newRows);
    saveInvoke(onUpdateData, newRows);
  };

  return (
    <>
      <DataTableEditable
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={entries}
        sticky={true}
        payload={{
          items,
          errors: errors || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
          autoFocus: ['item_id', 0],
        }}
        actions={
          <>
            <Button
              small={true}
              className={'button--secondary button--new-line'}
              onClick={onClickNewRow}
            >
              <T id={'new_lines'} />
            </Button>

            <Button
              small={true}
              className={'button--secondary button--clear-lines ml1'}
              onClick={handleClickClearAllLines}
            >
              <T id={'clear_all_lines'} />
            </Button>
          </>
        }
      />
      <ItemsEntriesDeleteAlert
        name={'items-entries-clear-lines'}
        onConfirm={handleClearLinesAlertConfirm}
      />
    </>
  );
}

ItemsEntriesTable.defaultProps = {
  defaultEntry: {
    index: 0,
    item_id: '',
    description: '',
    quantity: 1,
    rate: '',
    discount: '',
  },
  initialEntries: [],
  linesNumber: 4,
};

export default compose(withAlertActions)(ItemsEntriesTable);
