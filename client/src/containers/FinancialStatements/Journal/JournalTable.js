import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withJournal from './withJournal';

import { compose, defaultExpanderReducer } from 'utils';

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
    return types.indexOf(rowType) === -1 ? '' : value;
  };

  const exceptRowTypes = (rowType, value, types) => {
    return types.indexOf(rowType) !== -1 ? '' : value;
  };

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'date' }),
        accessor: (r) =>
          rowTypeFilter(r.rowType, moment(r.date).format('YYYY MMM DD'), [
            'first_entry',
          ]),
        className: 'date',
        width: 85,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: (r) =>
          rowTypeFilter(r.rowType, r.transaction_type, ['first_entry']),
        className: 'reference_type_formatted',
        width: 145,
      },
      {
        Header: formatMessage({ id: 'num' }),
        accessor: (r) =>
          rowTypeFilter(r.rowType, r.reference_id, ['first_entry']),
        className: 'reference_id',
        width: 70,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
      },
      {
        Header: formatMessage({ id: 'acc_code' }),
        accessor: 'account.code',
        width: 95,
        className: 'account_code',
      },
      {
        Header: formatMessage({ id: 'account' }),
        accessor: 'account.name',
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: (r) =>
          exceptRowTypes(
            r.rowType,
            <Money amount={r.credit} currency={'USD'} />,
            ['space_entry'],
          ),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: (r) =>
          exceptRowTypes(
            r.rowType,
            <Money amount={r.debit} currency={'USD'} />,
            ['space_entry'],
          ),
      },
    ],
    [formatMessage],
  );

  const handleFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'journal_sheet' })}
      fromDate={journalSheetQuery.from_date}
      toDate={journalSheetQuery.to_date}
      name="journal"
      loading={journalSheetLoading}
      // minimal={true}
      fullWidth={true}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={journalSheetTableRows}
        onFetchData={handleFetchData}
        noResults={formatMessage({
          id: 'this_report_does_not_contain_any_data_between_date_period',
        })}
        expanded={expandedRows}
        sticky={true}
      />
    </FinancialSheet>
  );
}

export default compose(
  withJournal(
    ({ journalSheetTableRows, journalSheetLoading, journalSheetQuery }) => ({
      journalSheetTableRows,
      journalSheetLoading,
      journalSheetQuery,
    }),
  ),
)(JournalSheetTable);
