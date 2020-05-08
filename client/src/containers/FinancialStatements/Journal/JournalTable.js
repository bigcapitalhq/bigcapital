import React, {useState, useEffect, useCallback, useMemo} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import {compose, defaultExpanderReducer} from 'utils';
import moment from 'moment';
import JournalConnect from 'connectors/Journal.connect';
import {
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';
import {connect} from 'react-redux';
import Money from 'components/Money';

function JournalSheetTable({
  onFetchData,
  data,
  loading,
  companyName,
}) {
  const rowTypeFilter = (rowType, value, types) => {
    return (types.indexOf(rowType) === -1) ? '' : value;
  };

  const exceptRowTypes = (rowType, value, types) => {
    return (types.indexOf(rowType) !== -1) ? '' : value;    
  };
  const columns = useMemo(() => [
    {
      Header: 'Date',
      accessor: r => rowTypeFilter(r.rowType, moment(r.date).format('YYYY/MM/DD'), ['first_entry']),
      className: 'date',
      width: 85,
    },
    {
      Header: 'Transaction Type',
      accessor: r => rowTypeFilter(r.rowType, r.transaction_type, ['first_entry']),
      className: "transaction_type",
      width: 145,
    },
    {
      Header: 'Num.',
      accessor: r => rowTypeFilter(r.rowType, r.reference_id, ['first_entry']),
      className: 'reference_id',
      width: 70,
    },
    {
      Header: 'Description',
      accessor: 'note',
    },
    {
      Header: 'Acc. Code',
      accessor: 'account.code',
      width: 120,
      className: 'account_code',
    },
    {
      Header: 'Account',
      accessor: 'account.name',
    },
    {
      Header: 'Credit',
      accessor: r => exceptRowTypes(
        r.rowType, (<Money amount={r.credit} currency={'USD'} />), ['space_entry']),
    },
    {
      Header: 'Debit',
      accessor: r => exceptRowTypes(
        r.rowType, (<Money amount={r.debit} currency={'USD'} />), ['space_entry']),
    },
  ], []);

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args)
  }, [onFetchData]);

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer(data, 1), [data]);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={'Journal Sheet'}
      date={new Date()}
      name="journal"
      loading={loading}>
      
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={data}
        onFetchData={handleFetchData}
        noResults={"This report does not contain any data."}
        expanded={expandedRows}
        noInitialFetch={true} />
    </FinancialSheet>
  );
}

export default compose(
  JournalConnect,
)(JournalSheetTable);