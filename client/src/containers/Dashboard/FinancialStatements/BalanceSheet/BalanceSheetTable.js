import React, {useMemo, useState, useCallback, useEffect} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import FinancialStatementConnect from 'connectors/FinancialStatements.connector';
import {compose} from 'utils';
import moment from 'moment';
import Money from 'components/Money';

function BalanceSheetTable({
  balanceSheet,
  balanceSheetIndex,
  getBalanceSheetColumns,

  getBalanceSheetAssetsAccounts,
  getBalanceSheetLiabilitiesAccounts,

  getBalanceSheetQuery,

  onFetchData,
  asDate,
}) {
  const balanceSheetColumns = useMemo(() => 
    getBalanceSheetColumns(balanceSheetIndex),
    [getBalanceSheetColumns, balanceSheetIndex]);

  const balanceSheetQuery = useMemo(() => 
    getBalanceSheetQuery(balanceSheetIndex),
    [getBalanceSheetQuery, balanceSheetIndex])

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
    ...(balanceSheetQuery &&
        balanceSheetQuery.display_columns_by === 'total') ? [
      {
        Header: 'Total',
        accessor: 'balance.formatted_amount',
        Cell: ({ cell }) => {
          const row = cell.row.original;
          if (!row.balance) { return ''; }
          return (<Money amount={row.balance.formatted_amount} currency={'USD'} />);
        },
        className: "credit",
      }
    ] : (balanceSheetColumns.map((column, index) => ({
      Header: column,
      accessor: (row) => {
        if (row.periods_balance && row.periods_balance[index]) {
          return row.periods_balance[index].formatted_amount;
        }
      },
    }))),
  ], [balanceSheetColumns, balanceSheetQuery]);
 
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!balanceSheet) { return; }
    setData([
      {
        name: 'Assets',
        children: getBalanceSheetAssetsAccounts(balanceSheetIndex),
      },
      {
        name: 'Liabilies & Equity',
        children: getBalanceSheetLiabilitiesAccounts(balanceSheetIndex),
      }
    ])
  }, []);

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Balance Sheet'}
      date={asDate}>
      
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={data}
        onFetchData={handleFetchData} />
    </FinancialSheet>
  );
}

export default compose(
  FinancialStatementConnect,
)(BalanceSheetTable);