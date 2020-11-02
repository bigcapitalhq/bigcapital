import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import { sumBy } from 'lodash';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { DataTable, Money } from 'components';
import { transformUpdatedRows } from 'utils';
import {
  MoneyFieldCell,
  DivFieldCell,
  EmptyDiv,
} from 'components/DataTableCells';

/**
 * Cell renderer guard.
 */
const CellRenderer = (content, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return content(props);
};

const TotalCellRederer = (content, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return <Money amount={props.cell.row.original[type]} currency={'USD'} />
  }
  return content(props);
};

export default function PaymentReceiveItemsTableEditor ({
  onClickClearAllLines,
  onUpdateData,
  data,
  errors,
  noResultsMessage,
}) {
  const transformedData = useMemo(() => {
    const rows = [ ...data ];
    const totalRow = {
      due_amount: sumBy(data, 'due_amount'),
      payment_amount: sumBy(data, 'payment_amount'),
    };
    if (rows.length > 0) { rows.push(totalRow) }
    return rows;
  }, [data]);

  const [localData, setLocalData] = useState(transformedData);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (localData !== transformedData) {
      setLocalData(transformedData);
    }
  }, [setLocalData, localData, transformedData]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'invoice.invoice_date',
        accessor: (r) => moment(r.invoice_date).format('YYYY MMM DD'),
        Cell: CellRenderer(EmptyDiv, 'invoice_date'),
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },

      {
        Header: formatMessage({ id: 'invocie_number' }),
        accessor: (row) => `#${row?.invoice?.invoice_no}`,
        Cell: CellRenderer(EmptyDiv, 'invoice_no'),
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'invoice_amount' }),
        accessor: 'invoice.balance',
        Cell: CellRenderer(DivFieldCell, 'balance'),
        disableSortBy: true,
        width: 100,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'invoice.due_amount',
        Cell: TotalCellRederer(DivFieldCell, 'due_amount'),
        disableSortBy: true,
        width: 150,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Cell: TotalCellRederer(MoneyFieldCell, 'payment_amount'),
        disableSortBy: true,
        width: 150,
        className: '',
      },
    ],
    [formatMessage],
  );

  // Handle click clear all lines button.
  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };

  const rowClassNames = useCallback(
    (row) =>  ({ 'row--total': localData.length === row.index + 1 }),
    [localData],
  );

  // Handle update data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = transformUpdatedRows(
        localData,
        rowIndex,
        columnId,
        value,
      );
      if (newRows.length > 0) {
        newRows.splice(-1, 1);
      }
      setLocalData(newRows);
      onUpdateData && onUpdateData(newRows);
    },
    [localData, setLocalData, onUpdateData],
  );

  return (
    <div className={classNames(
      CLASSES.DATATABLE_EDITOR,
      CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES,
    )}>
      <DataTable
        columns={columns}
        data={localData}
        rowClassNames={rowClassNames}
        spinnerProps={false}
        payload={{
          errors,
          updateData: handleUpdateData,
        }}
        noResults={noResultsMessage}
      />
      <div className={classNames(CLASSES.DATATABLE_EDITOR_ACTIONS, 'mt1')}>
        <Button
          small={true}
          className={'button--secondary button--clear-lines'}
          onClick={handleClickClearAllLines}
        >
          <T id={'clear_all_lines'} />
        </Button>
      </div>
    </div>
  );

}