import React, { useCallback, useMemo } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import {compose, defaultExpanderReducer} from 'utils';

import Money from 'components/Money';
import {
  getFinancialSheetIndexByQuery,
} from 'store/financialStatement/financialStatements.selectors';

import withJournal from './withJournal';
import { FormattedMessage as T, useIntl } from 'react-intl';


function JournalSheetTable({
  // #withJournal
  journalSheetTableRows,
  journalSheetLoading,
  journalSheetQuery,

  // #ownProps
  onFetchData,
  companyName,
}) {
  const { formatMessage } = useIntl();

  const rowTypeFilter = (rowType, value, types) => {
    return (types.indexOf(rowType) === -1) ? '' : value;
  };

  const exceptRowTypes = (rowType, value, types) => {
    return (types.indexOf(rowType) !== -1) ? '' : value;    
  };

  const columns = useMemo(() => [
    {
      Header: formatMessage({id:'date'}),
      accessor: r => rowTypeFilter(r.rowType, moment(r.date).format('YYYY/MM/DD'), ['first_entry']),
      className: 'date',
      width: 85,
    },
    {
      Header: formatMessage({id:'transaction_type'}),
      accessor: r => rowTypeFilter(r.rowType, r.transaction_type, ['first_entry']),
      className: "transaction_type",
      width: 145,
    },
    {
      Header: formatMessage({id:'num'}),
      accessor: r => rowTypeFilter(r.rowType, r.reference_id, ['first_entry']),
      className: 'reference_id',
      width: 70,
    },
    {
      Header: formatMessage({id:'description'}),
      accessor: 'note',
    },
    {
      Header: formatMessage({id:'acc_code'}),
      accessor: 'account.code',
      width: 120,
      className: 'account_code',
    },
    {
      Header: formatMessage({id:'account'}),
      accessor: 'account.name',
    },
    {
      Header: formatMessage({id:'credit'}),
      accessor: r => exceptRowTypes(
        r.rowType, (<Money amount={r.credit} currency={'USD'} />), ['space_entry']),
    },
    {
      Header: formatMessage({id:'debit'}),
      accessor: r => exceptRowTypes(
        r.rowType, (<Money amount={r.debit} currency={'USD'} />), ['space_entry']),
    },
  ], []);

  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args)
  }, [onFetchData]);

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={'Journal Sheet'}
      fromDate={journalSheetQuery.from_date}
      toDate={journalSheetQuery.to_date}
      name="journal"
      loading={journalSheetLoading}>
 
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={journalSheetTableRows}
        onFetchData={handleFetchData}
        noResults={"This report does not contain any data between date period."}
        expanded={expandedRows} />
    </FinancialSheet>
  );
}


const mapStateToProps = (state, props) => {
  const { journalQuery } = props;
  return {
    journalIndex: getFinancialSheetIndexByQuery(
      state.financialStatements.journal.sheets,
      journalQuery,
    ) 
  };
}

const withJournalTable = connect(mapStateToProps);

export default compose(
  withJournalTable,
  withJournal(({ journalSheetTableRows, journalSheetLoading, journalSheetQuery }) => ({
    journalSheetTableRows,
    journalSheetLoading,
    journalSheetQuery,
  })),
)(JournalSheetTable);