import React from 'react';
import intl from 'react-intl-universal';
import {
  InputGroupCell,
  TextAreaCell,
  SwitchFieldCell,
} from 'components/DataTableCells';
import { DataTableEditable } from 'components';
import { compose, updateTableCell } from 'utils';

export default function SMSMessageTemplatesEntriesTable({
  onUpdateData,
  entries,
}) {
  const columns = React.useMemo(() => [
    {
      Header: intl.get('sms_message_template.label_Notification'),
      accessor: 'notification',
      Cell: InputGroupCell,
      disableSortBy: true,
      width: '150',
    },
    {
      Header: intl.get('service'),
      accessor: 'service',
      Cell: InputGroupCell,
      disableSortBy: true,
      width: '150',
    },
    {
      Header: intl.get('sms_message_template.label_mesage'),
      accessor: 'message',
      // Cell: TextAreaCell,
      Cell: InputGroupCell,
      disableSortBy: true,
      width: '150',
    },
    {
      Header: intl.get('sms_message_template.label_auto'),
      accessor: 'auto',
      Cell: SwitchFieldCell,
      disableSortBy: true,
      disableResizing: true,
      width: '120',
    },
  ]);

  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      payload={{
        errors: [],
        updateData: handleUpdateData,
      }}
    />
  );
}
