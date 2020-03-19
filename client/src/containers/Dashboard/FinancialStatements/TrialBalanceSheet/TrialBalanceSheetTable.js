import React, {useEffect, useState, useMemo} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';


export default function TrialBalanceSheetTable({
  trialBalanceSheetAccounts,
  trialBalanceSheetIndex,
}) {
  const [data, setData] = useState([]);

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
    {
      Header: 'Credit',
      accessor: 'credit',
      className: 'credit',
    },
    {
      Header: 'debit',
      accessor: 'debit',
      className: 'debit',
    },
    {
      Header: 'Balance',
      accessor: 'balance',
      className: 'balance',
    }
  ], []);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Trial Balance Sheet'}
      date={''}>

      <DataTable
        columns={columns}
        data={trialBalanceSheetAccounts} />
    </FinancialSheet>
  ); 
}