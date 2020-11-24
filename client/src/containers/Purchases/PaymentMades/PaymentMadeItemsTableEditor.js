import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    return <Money amount={props.cell.row.original[type]} currency={'USD'} />;
  }
  return content(props);
};

/**
 * Payment made items editor table.
 */
export default function PaymentMadeItemsTableEditor({
  //#ownProps
  onClickClearAllLines,
  onUpdateData,
  data,
  errors,
  noResultsMessage,
}) {
  const transformedData = useMemo(() => {
    const rows = [...data];
    const totalRow = {
      due_amount: sumBy(data, 'due_amount'),
      payment_amount: sumBy(data, 'payment_amount'),
    };
    if (rows.length > 0) {
      rows.push(totalRow);
    }
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
        id: 'bill_date',
        accessor: (r) => moment(r.bill_date).format('YYYY MMM DD'),
        Cell: CellRenderer(EmptyDiv, 'bill_date'),
        disableSortBy: true,
      },
      {
        Header: formatMessage({ id: 'bill_number' }),
        accessor: (row) => `#${row?.bill_number || ''}`,
        Cell: CellRenderer(EmptyDiv, 'bill_number'),
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: formatMessage({ id: 'bill_amount' }),
        accessor: 'amount',
        Cell: CellRenderer(DivFieldCell, 'amount'),
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Cell: TotalCellRederer(DivFieldCell, 'due_amount'),
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Cell: TotalCellRederer(MoneyFieldCell, 'payment_amount'),
        disableSortBy: true,
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
    (row) => ({ 'row--total': localData.length === row.index + 1 }),
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
      newRows.splice(-1, 1); // removes the total row.

      setLocalData(newRows);
      onUpdateData && onUpdateData(newRows);
    },
    [localData, setLocalData, onUpdateData],
  );

  return (
    <div
      className={classNames(
        CLASSES.DATATABLE_EDITOR,
        CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES,
      )}
    >
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
