import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import { DataTableEditable } from 'components';
import ExpenseDeleteEntriesAlert from 'containers/Alerts/Expenses/ExpenseDeleteEntriesAlert';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { useExpenseFormTableColumns } from './components';

import withAlertActions from 'containers/Alert/withAlertActions';

import { transformUpdatedRows, compose, saveInvoke, repeatValue } from 'utils';

/**
 * Expenses form entries.
 */
function ExpenseFormEntriesTable({
  // #withAlertActions 
  openAlert,

  // #ownPorps
  entries,
  defaultEntry,
  error,
  onChange,
}) {
  // Expense form context.
  const { accounts } = useExpenseFormContext();

  // Memorized data table columns.
  const columns = useExpenseFormTableColumns();

  // Handles update datatable data.
  const handleUpdateData = useCallback(
    (rowIndex, columnIdOrObj, value) => {
      const newRows = transformUpdatedRows(
        entries,
        rowIndex,
        columnIdOrObj,
        value,
      );
      saveInvoke(onChange, newRows);
    },
    [entries, onChange],
  );

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback(
    (rowIndex) => {
      // Can't continue if there is just one row line or less.
      if (entries.length <= 1) {
        return;
      }
      const newRows = entries.filter((row, index) => index !== rowIndex);
      saveInvoke(onChange, newRows);
    },
    [entries, onChange],
  );

  // Invoke when click on add new line button.
  const onClickNewRow = () => {
    const newRows = [...entries, defaultEntry];
    saveInvoke(onChange, newRows);
  };

  // Invoke when click on clear all lines button.
  const handleClickClearAllLines = () => {
    openAlert('expense-delete-entries');
  };

  // handle confirm clear all entries alert.
  const handleConfirmClearEntriesAlert = () => {
    const newRows = repeatValue(defaultEntry, 3);
    saveInvoke(onChange, newRows);
  };

  return (
    <>
      <DataTableEditable
        columns={columns}
        data={entries}
        sticky={true}
        payload={{
          accounts: accounts,
          errors: error,
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
          autoFocus: ['expense_account_id', 0],
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
        totalRow={true}
      />
      <ExpenseDeleteEntriesAlert
        name={'expense-delete-entries'}
        onConfirm={handleConfirmClearEntriesAlert}
      />
    </>
  );
}

export default compose(
  withAlertActions
)(ExpenseFormEntriesTable);