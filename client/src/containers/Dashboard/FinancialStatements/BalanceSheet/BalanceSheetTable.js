import React, {useMemo, useState} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';

export default function BalanceSheetTable({

}) {

  const columns = useMemo(() => [
    {
      Header: 'Account Name',
      accessor: 'index',
      className: "actions",
    },
    {
      Header: 'Code', 
      accessor: 'note',
      className: "note",
    },
    {
      Header: 'Total',
      accessor: 'total',
      className: "credit",
    },
  ]);

  const [data, setData] = useState([]);

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