import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withJournal from './withJournal';

import { compose, defaultExpanderReducer, getForceWidth } from 'utils';

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

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'date' }),
        accessor: row => row.date ? moment(row.date).format('YYYY MMM DD') : '',
        className: 'date',
        width: 100,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'reference_type_formatted',
        className: 'reference_type_formatted',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'num' }),
        accessor: 'reference_id',
        className: 'reference_id',
        width: 70,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'note'
      },
      {
        Header: formatMessage({ id: 'acc_code' }),
        accessor: 'account_code',
        width: 95,
        className: 'account_code',
      },
      {
        Header: formatMessage({ id: 'account' }),
        accessor: 'account_name',
        className: 'account_name',
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'formatted_credit',
        className: 'credit'
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'formatted_debit',
        className: 'debit'
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

  const rowClassNames = useCallback((row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowType)
      ? original.rowType
      : [original.rowType];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  }, []);

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
        rowClassNames={rowClassNames}
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
