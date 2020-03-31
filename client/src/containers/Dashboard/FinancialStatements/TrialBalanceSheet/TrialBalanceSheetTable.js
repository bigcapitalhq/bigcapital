import React, {useEffect, useState, useCallback, useMemo} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

export default function TrialBalanceSheetTable({
  trialBalanceSheetAccounts,
  trialBalanceSheetIndex,
  onFetchData,
  loading,
}) {
  const [data, setData] = useState([]);

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
      className: "name",
    },
    {
      Header: 'Code', 
      accessor: 'code',
      className: "code",
      width: 120,
    },
    {
      Header: 'Credit',
      accessor: r => (<Money amount={r.credit} currency="USD" />),
      className: 'credit',
      width: 120,
    },
    {
      Header: 'Debit',
      accessor: r => (<Money amount={r.debit} currency="USD" />),
      className: 'debit',
      width: 120,
    },
    {
      Header: 'Balance',
      accessor: r => (<Money amount={r.balance} currency="USD" />),
      className: 'balance',
      width: 120,
    }
  ], []);

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Trial Balance Sheet'}
      date={new Date()}
      name="trial-balance"
      loading={loading}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={trialBalanceSheetAccounts}
        onFetchData={handleFetchData} />
    </FinancialSheet>
  ); 
}