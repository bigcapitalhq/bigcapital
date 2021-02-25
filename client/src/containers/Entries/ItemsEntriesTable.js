import React, { useEffect, useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { useItem } from 'hooks/query';

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
import { updateItemsEntriesTotal, ITEM_TYPE } from './utils';
import { last } from 'lodash';

const updateAutoAddNewLine = (defaultEntry) => (entries) => {
  const newEntries = [...entries];
  const lastEntry = last(newEntries);

  return (lastEntry.item_id) ? [...entries, defaultEntry] : [...entries];
};

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
  itemType, // sellable or purchasable
}) {
  const [rows, setRows] = React.useState(initialEntries);
  const [rowItem, setRowItem] = React.useState(null);
  const [cellsLoading, setCellsLoading] = React.useState(null);

  // Fetches the item details.
  const { data: item, isFetching: isItemFetching } = useItem(
    rowItem && rowItem.itemId,
    {
      enabled: !!rowItem,
    },
  );

  // Once the item start loading give the table cells loading state.
  useEffect(() => {
    if (rowItem && isItemFetching) {
      setCellsLoading([
        [rowItem.rowIndex, 'rate'],
        [rowItem.rowIndex, 'description'],
        [rowItem.rowIndex, 'quantity'],
        [rowItem.rowIndex, 'discount'],
      ]);
    } else {
      setCellsLoading(null);
    }
  }, [isItemFetching, setCellsLoading, rowItem]);

  // Once the item selected and fetched set the initial details to the table.
  useEffect(() => {
    if (item && rowItem) {
      const { rowIndex } = rowItem;
      const price =
        itemType === ITEM_TYPE.PURCHASABLE
          ? item.purchase_price
          : item.sell_price;

      const description =
        itemType === ITEM_TYPE.PURCHASABLE
          ? item.purchase_description
          : item.sell_description;

      // Update the rate, description and quantity data of the row.
      const newRows = compose(
        updateItemsEntriesTotal,
        updateTableRow(rowIndex, 'rate', price),
        updateTableRow(rowIndex, 'description', description),
        updateTableRow(rowIndex, 'quantity', 1),
      )(rows);

      setRows(newRows);
      setRowItem(null);
      saveInvoke(onUpdateData, newRows);
    }
  }, [item, rowItem, rows, itemType, onUpdateData]);

  // Allows to observes `entries` to make table rows outside controlled.
  useEffect(() => {
    if (entries && entries !== rows) {
      setRows(entries);
    }
  }, [entries, rows]);

  // Editiable items entries columns.
  const columns = useEditableItemsEntriesColumns();

  // Handles the editor data update.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      if (columnId === 'item_id') {
        setRowItem({ rowIndex, columnId, itemId: value });
      }
      const newRows = compose(
        updateAutoAddNewLine(defaultEntry),
        updateItemsEntriesTotal,
        updateTableRow(rowIndex, columnId, value),
      )(rows);

      setRows(newRows);
      onUpdateData(newRows);
    },
    [rows, defaultEntry, onUpdateData],
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

  // Handle alert confirm of clear all lines.
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
        data={rows}
        sticky={true}
        progressBarLoading={isItemFetching}
        cellsLoading={isItemFetching}
        cellsLoadingCoords={cellsLoading}
        footer={true}
        payload={{
          items,
          errors: errors || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
          autoFocus: ['item_id', 0],
        }}
         
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
