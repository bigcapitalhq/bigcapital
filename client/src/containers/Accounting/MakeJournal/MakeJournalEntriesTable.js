import React from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke, removeRowsByIndex } from 'utils';
import { DataTableEditable } from 'components';
import withAlertActions from 'containers/Alert/withAlertActions';

import { updateDataReducer } from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useJournalTableEntriesColumns } from './components';

import JournalDeleteEntriesAlert from 'containers/Alerts/ManualJournals/JournalDeleteEntriesAlert';
import { compose } from 'redux';
import { repeatValue } from 'utils';

/**
 * Make journal entries table component.
 */
function MakeJournalEntriesTable({
  // #withAlertsActions
  openAlert,

  // #ownPorps
  onChange,
  entries,
  defaultEntry,
  error,
  initialLinesNumber = 4,
  minLinesNumber = 4,
}) {
  const { accounts, customers } = useMakeJournalFormContext();

  // Memorized data table columns.
  const columns = useJournalTableEntriesColumns();

  // Handles click new line.
  const onClickNewRow = () => {
    const newRows = [...entries, defaultEntry];
    saveInvoke(onChange, newRows);
  };

  // Handles update datatable data.
  const handleUpdateData = (rowIndex, columnId, value) => {
    const newRows = updateDataReducer(entries, rowIndex, columnId, value);
    saveInvoke(onChange, newRows);
  };

  // Handle remove datatable row.
  const handleRemoveRow = (rowIndex) => {
    const newRows = removeRowsByIndex(entries, rowIndex);
    saveInvoke(onChange, newRows);
  };

  // Handle clear all lines action.
  const handleClickClearAllLines = () => {
    openAlert('make-journal-delete-all-entries');
  };

  // Handle clear all lines alaert confirm.
  const handleCofirmClearEntriesAlert = () => {
    const newRows = repeatValue(defaultEntry, initialLinesNumber);
    saveInvoke(onChange, newRows);
  };

  return (
    <>
      <DataTableEditable
        columns={columns}
        data={entries}
        sticky={true}
        totalRow={true}
        payload={{
          accounts,
          errors: error,
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
          contacts: customers.map((customer) => ({
            ...customer,
            contact_type: 'customer',
          })),
          autoFocus: ['account_id', 0],
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
      <JournalDeleteEntriesAlert
        name={'make-journal-delete-all-entries'}
        onConfirm={handleCofirmClearEntriesAlert}
      />
    </>
  );
}

export default compose(withAlertActions)(MakeJournalEntriesTable);
