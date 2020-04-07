import React, {useState, useMemo, useCallback} from 'react';
import DataTable from 'components/DataTable';
import {
  Button,
  Intent,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import AccountsConnect from 'connectors/Accounts.connector.js';
import {compose, formattedAmount} from 'utils';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
  InputGroupCell,
} from 'comp}onents/DataTableCells';

// Actions cell renderer.
const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
  if (data.length <= (index + 2)) {
    return '';
  }
  const onClickRemoveRole = () => {
    payload.removeRow(index);
  };

  return (
    <Button 
      icon={<Icon icon="times-circle" iconSize={14} />}
      iconSize={14}
      className="ml2"
      minimal={true}
      intent={Intent.DANGER}
      onClick={onClickRemoveRole} />
  );
};

// Total text cell renderer.
const TotalAccountCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === (props.row.index + 2)) {
    return (<span>{ 'Total USD' }</span>);
  }
  return chainedComponent(props);
};

// Total credit/debit cell renderer.
const TotalCreditDebitCellRenderer = (chainedComponent, type) => (props) => {
  if (props.data.length === (props.row.index + 2)) {
    const total = props.data.reduce((total, entry) => {
      const amount = parseInt(entry[type], 10);
      const computed = amount ? total + amount : total;

      return computed;
    }, 0);

    return (<span>{ formattedAmount(total, 'USD') }</span>);
  }
  return chainedComponent(props);
};

const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === (props.row.index + 2)) {
    return '';
  }
  return chainedComponent(props);
};

function MakeJournalEntriesTable({
  formik,
  accounts,
  onClickRemoveRow,
  onClickAddNewRow,
  defaultRow,
}) {
  const [rows, setRow] = useState([
    ...formik.values.entries.map((e) => ({ ...e, rowType: 'editor'})),
  ]);

  // Handles update datatable data.
  const handleUpdateData = useCallback((rowIndex, columnId, value) => {
    setRow((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }, []);

  // Handles click remove datatable row.
  const handleRemoveRow = useCallback((rowIndex) => {
    const removeIndex = parseInt(rowIndex, 10);
    setRow([
      ...rows.filter((row, index) => index !== removeIndex),
    ]);
    onClickRemoveRow && onClickRemoveRow(removeIndex);
  }, [rows, onClickRemoveRow]);

  // Memorized data table columns.
  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'index',
      Cell: ({ row: {index} }) => (
        <span>{ index + 1 }</span>
      ),
      className: "index",
      width: 40,
      disableResizing: true,
      disableSortBy: true,
    },
    {
      Header: 'Account',
      accessor: 'account',
      Cell: TotalAccountCellRenderer(AccountsListFieldCell),
      className: "account",
      disableSortBy: true,
      disableResizing: true,
      width: 250,
    },
    {
      Header: 'Credit (USD)',
      accessor: 'credit',
      Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'credit'),
      className: "credit",
      disableSortBy: true,
      disableResizing: true,
      width: 150,
    },
    {
      Header: 'Debit (USD)',
      accessor: 'debit',
      Cell: TotalCreditDebitCellRenderer(MoneyFieldCell, 'debit'),
      className: "debit",
      disableSortBy: true,
      disableResizing: true,
      width: 150,
    },
    {
      Header: 'Note', 
      accessor: 'note',
      Cell: NoteCellRenderer(InputGroupCell),
      disableSortBy: true,
      className: "note",
    },
    {
      Header: '',
      accessor: 'action',
      Cell: ActionsCellRenderer,
      className: "actions",
      disableSortBy: true,
      disableResizing: true,
      width: 45,
    }
  ], []);

  // Handles click new line.
  const onClickNewRow = useCallback(() => {
    setRow([
      ...rows,
      { ...defaultRow, rowType: 'editor' },
    ]);
    onClickAddNewRow && onClickAddNewRow();
  }, [defaultRow, rows, onClickAddNewRow]);

  const rowClassNames = useCallback((row) => ({
    'row--total': rows.length === (row.index + 2),
  }), [rows]);
  return (
    <div class="make-journal-entries__table">
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        payload={{
          accounts,
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
        }}/>

      <div class="mt1">
        <Button
          small={true}
          className={'button--secondary button--new-line'}
          onClick={onClickNewRow}>
          New lines
        </Button>

        <Button
          small={true}
          className={'button--secondary button--clear-lines ml1'}
          onClick={onClickNewRow}>
          Clear all lines
        </Button>
      </div>
    </div>
  );
}

export default compose(
  AccountsConnect,
)(MakeJournalEntriesTable);