import React, {useMemo, useState, useEffect} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import FinancialStatementConnect from 'connectors/FinancialStatements.connector';
import {compose} from 'utils';
import moment from 'moment';

function BalanceSheetTable({
  balanceSheet,
  balanceSheetIndex,
  getBalanceSheetColumns,

  getBalanceSheetAssetsAccounts,
  getBalanceSheetLiabilitiesAccounts,

  getBalanceSheetQuery,
}) {
  const balanceSheetColumns = useMemo(() => {
    return getBalanceSheetColumns(balanceSheetIndex);
  }, [getBalanceSheetColumns]);

  const balanceSheetQuery = useMemo(() => {
    return getBalanceSheetQuery(balanceSheetIndex);
  }, [getBalanceSheetQuery])

  const columns = useMemo(() => [
    {
      // Build our expander column
      id: 'expander', // Make sure it has an ID
      Header: ({
        getToggleAllRowsExpandedProps,
        isAllRowsExpanded
      }) => (
        <span {...getToggleAllRowsExpandedProps()}>
          {isAllRowsExpanded ? '👇' : '👉'}
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
            })}
          >
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ) : null,
    },
    {
      Header: 'Account Name',
      accessor: 'name',
      className: "actions",
    },
    {
      Header: 'Code', 
      accessor: 'code',
      className: "note",
    },
    ...(balanceSheetQuery &&
        balanceSheetQuery.display_columns_by === 'total') ? [
      {
        Header: 'Total',
        accessor: 'balance.formatted_amount',
        className: "credit",
      }
    ]: (balanceSheetColumns.map((column, index) => ({
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
        code: '',
        children: [
          ...getBalanceSheetAssetsAccounts(balanceSheetIndex),
        ],
      },
      {
        name: 'Liabilies & Equity',
        code: '',
        children: [
          ...getBalanceSheetLiabilitiesAccounts(balanceSheetIndex),
        ]
      }
    ])
  }, [])

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Balance Sheet'}
      date={''}>
      
      <DataTable
        columns={columns}
        data={data} />

    </FinancialSheet>
  )
}

export default compose(
  FinancialStatementConnect,
)(BalanceSheetTable);