import React from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke, removeRowsByIndex } from 'utils';
import { DataTableEditable } from 'components';
import withAlertActions from 'containers/Alert/withAlertActions';

import { updateDataReducer } from './utils';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useJournalTableEntriesColumns } from './components';

import { compose } from 'redux';

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
 
 
  return (

    <DataTableEditable
      columns={columns}
      data={entries}
      sticky={true}
      totalRow={true}
      footer={true}
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
    /> 
  );
}

export default compose(withAlertActions)(MakeJournalEntriesTable);
