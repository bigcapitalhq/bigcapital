import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button  } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import { sumBy } from 'lodash';

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

/**
 * Payment made items editor table.
 */
export default function PaymentMadeItemsTableEditor({
  //#ownProps
  onClickClearAllLines,
  onUpdateData,
  data,
  errors
}) {
  const transformedData = useMemo(() => {
    return [ ...data, {
      due_amount: sumBy(data, 'due_amount'),
      payment_amount: sumBy(data, 'payment_amount'),
    }];
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
        disableResizing: true,
        width: 250,
      },

      {
        Header: formatMessage({ id: 'bill_number' }),
        accessor: (row) => `#${row.bill_number}`,
        Cell: CellRenderer(EmptyDiv, 'bill_number'),
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: formatMessage({ id: 'bill_amount' }),
        accessor: 'amount',
        Cell: CellRenderer(DivFieldCell, 'amount'),
        disableSortBy: true,
        width: 100,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
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

  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };

  const rowClassNames = useCallback(
    (row) => {  
      return { 'row--total': localData.length === row.index + 1 };
    },
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
      setLocalData(newRows);
      onUpdateData && onUpdateData(newRows);
    },
    [localData, setLocalData, onUpdateData],
  );

  return (
    <div className={'estimate-form__table'}>
      <DataTable
        columns={columns}
        data={localData}
        rowClassNames={rowClassNames}
        spinnerProps={false}
        payload={{
          errors,
          updateData: handleUpdateData,
        }}
      />
      <div className={'mt1'}>
        <Button
          small={true}
          className={'button--secondary button--clear-lines ml1'}
          onClick={handleClickClearAllLines}
        >
          <T id={'clear_all_lines'} />
        </Button>
      </div>
    </div>
  );
}
