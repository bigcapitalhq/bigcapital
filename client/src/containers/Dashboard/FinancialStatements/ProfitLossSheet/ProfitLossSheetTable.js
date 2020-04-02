import React, {useState, useMemo, useCallback} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';


export default function ProfitLossSheetTable({
  loading,
  data,
  onFetchData,
}) {
  const columns = useMemo(() => [
    {
      Header: 'Account Name',
      accessor: 'name',
      className: "name",
    },
    {
      Header: 'Acc. Code',
      accessor: 'code',
      className: "account_code",
    },
  ])

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Profit/Loss Sheet'}
      date={new Date()}
      name="profit-loss-sheet"
      loading={loading}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={data}
        onFetchData={handleFetchData} />
    </FinancialSheet>
  )
}