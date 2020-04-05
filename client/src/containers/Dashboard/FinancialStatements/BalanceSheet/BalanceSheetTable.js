import React, {useMemo, useState, useCallback, useEffect} from 'react';
import moment from 'moment';
import Money from 'components/Money';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import BalanceSheetConnect from 'connectors/BalanceSheet.connect';
import BalanceSheetTableConnect from 'connectors/BalanceSheetTable.connect';
import {
  compose,
  defaultExpanderReducer,
} from 'utils';

function BalanceSheetTable({
  balanceSheetAccounts,
  balanceSheetColumns,
  balanceSheetQuery,
  onFetchData,
  asDate,
  loading,
}) {
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
      accessor: 'name',
      className: "account_name",
    },
    {
      Header: 'Code', 
      accessor: 'code',
      className: "code",
    },
    ...(balanceSheetQuery.display_columns_type === 'total') ? [
      {
        Header: 'Total',
        accessor: 'balance.formatted_amount',
        Cell: ({ cell }) => {
          const row = cell.row.original;
          if (row.total) {
            return (<Money amount={row.total.formatted_amount} currency={'USD'} />);
          }
          return '';          
        },
        className: "credit",
      }
    ] : [],
    ...(balanceSheetQuery.display_columns_type === 'date_periods') ? 
      (balanceSheetColumns.map((column, index) => ({
        id: `date_period_${index}`,
        Header: column,
        accessor: (row) => {
          if (row.total_periods && row.total_periods[index]) {
            const amount = row.total_periods[index].formatted_amount;
            return (<Money amount={amount} currency={'USD'} />);
          }
          return '';
        },
        width: 100,
      })))
    : [],
  ], [balanceSheetQuery, balanceSheetColumns]);
  
  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);


  // Calculates the default expanded rows of balance sheet table.
  const expandedRows = useMemo(() => 
    defaultExpanderReducer(balanceSheetAccounts, 1),
    [balanceSheetAccounts]);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Balance Sheet'}
      date={asDate}
      loading={loading}>
      
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={balanceSheetAccounts}
        onFetchData={handleFetchData}
        expandSubRows={true}
        expanded={expandedRows} />
    </FinancialSheet>
  );
}

export default compose(
  BalanceSheetConnect,
  BalanceSheetTableConnect,
)(BalanceSheetTable);