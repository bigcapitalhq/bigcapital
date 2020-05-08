import React, {useEffect, useState, useCallback, useMemo} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import moment from 'moment';
import {
  defaultExpanderReducer,
} from 'utils';


const ROW_TYPE = {
  CLOSING_BALANCE: 'closing_balance',
  OPENING_BALANCE: 'opening_balance',
  ACCOUNT: 'account_name',
  TRANSACTION: 'transaction',
}

export default function GeneralLedgerTable({
  companyName,
  onFetchData,
  loading,
  data,
}) {
  // Account name column accessor.
  const accountNameAccessor = useCallback((row) => {
    switch(row.rowType) {
      case ROW_TYPE.OPENING_BALANCE:
        return 'Opening Balance';
      case ROW_TYPE.CLOSING_BALANCE:
        return 'Closing Balance';
      default:
        return row.name;
    }
  }, [ROW_TYPE]);

  // Date accessor.
  const dateAccessor = useCallback((row) => {
    const TYPES = [
      ROW_TYPE.OPENING_BALANCE,
      ROW_TYPE.CLOSING_BALANCE,
      ROW_TYPE.TRANSACTION];

    return (TYPES.indexOf(row.rowType) !== -1)
      ? moment(row.date).format('DD-MM-YYYY') : '';
  }, [moment, ROW_TYPE]);

  // Amount cell
  const amountCell = useCallback(({ cell }) => {
    const transaction = cell.row.original

    if (transaction.rowType === ROW_TYPE.ACCOUNT) {
      return (!cell.row.isExpanded) ? 
        (<Money amount={transaction.closing.amount} currency={"USD"} />) : '';
    }
    return (<Money amount={transaction.amount} currency={"USD"} />);
  }, []);

  const referenceLink = useCallback((row) => {
    return (<a href="">{ row.referenceId }</a>);
  });

  const columns = useMemo(() => [
    {
      // Build our expander column
      id: 'expander', // Make sure it has an ID
      className: 'expander',      
      Header: ({
        getToggleAllRowsExpandedProps,
        isAllRowsExpanded
      }) => (
        <span {...getToggleAllRowsExpandedProps()} className="toggle">
          {isAllRowsExpanded ?
            (<span class="arrow-down" />) :
            (<span class="arrow-right" />)
          }
        </span>
      ),
      Cell: ({ row }) =>
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
        row.canExpand ? (
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                // We can even use the row.depth property
                // and paddingLeft to indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              },
              className: 'toggle',
            })}
          >
            {row.isExpanded ?
              (<span class="arrow-down" />) :
              (<span class="arrow-right" />)
            }
          </span>
        ) : null,
      width: 20,
      disableResizing: true,
    },
    {
      Header: 'Account Name',
      accessor: accountNameAccessor,
      className: "name",
    },
    {
      Header: 'Date',
      accessor: dateAccessor,
      className: "date",
    },
    {
      Header: 'Transaction Type',
      accessor: 'referenceType',
      className: 'transaction_type',
    },
    {
      Header: 'Trans. NUM',
      accessor: referenceLink,
      className: 'transaction_number'
    },
    {
      Header: 'Description',
      accessor: 'note',
      className: 'description',
    },
    {
      Header: 'Amount',
      Cell: amountCell,
      className: 'amount'
    },
    {
      Header: 'Balance',
      Cell: amountCell,
      className: 'balance',
    },
  ], []);

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  // Default expanded rows of general ledger table.
  const expandedRows = useMemo(() => defaultExpanderReducer(data, 1), [data]);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={'General Ledger Sheet'}
      date={new Date()}
      name="general-ledger"
      loading={loading}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={data}
        onFetchData={handleFetchData}
        expanded={expandedRows}
        virtualizedRows={true}
        fixedItemSize={37}
        fixedSizeHeight={1000}  />
    </FinancialSheet>
  ); 
}