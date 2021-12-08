import React from 'react';
import intl from 'react-intl-universal';
import { MoneyFieldCell, DataTableEditable, FormatDateCell } from 'components';
import { compose, updateTableCell } from 'utils';

export default function ReconcileVendorCreditEntriesTable({
  onUpdateData,
  entries,
  errors,
}) {
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('bill_date'),
        accessor: 'formatted_bill_date',
        Cell: FormatDateCell,
        disableSortBy: true,
        width: '120',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.bill_number'),
        accessor: 'bill_number',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.remaining_amount'),
        accessor: 'formatted_due_amount',
        disableSortBy: true,
        align: 'right',
        width: '150',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.amount_to_credit'),
        accessor: 'amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: '150',
      },
    ],
    [],
  );

  // Handle update data.
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
        errors: errors || [],
        updateData: handleUpdateData,
      }}
    />
  );
}
