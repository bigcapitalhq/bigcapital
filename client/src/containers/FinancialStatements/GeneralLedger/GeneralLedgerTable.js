import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { defaultExpanderReducer, compose } from 'utils';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withGeneralLedger from './withGeneralLedger';
import { getForceWidth, getColumnWidth } from 'utils';

const ROW_TYPE = {
  CLOSING_BALANCE: 'closing_balance',
  OPENING_BALANCE: 'opening_balance',
  ACCOUNT: 'account_name',
  TRANSACTION: 'transaction',
};

function GeneralLedgerTable({
  companyName,

  generalLedgerSheetLoading,
  generalLedgerTableRows,
  generalLedgerQuery,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'date' }),
        accessor: (row) => {
          if (row.rowType === 'ACCOUNT_ROW') {
            return (
              <span
                className={'force-width'}
                style={{ minWidth: getForceWidth(row.date) }}
              >
                {row.date}
              </span>
            );
          }
          return row.date;
        },
        className: 'date',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'name',
        textOverview: true,
        // width: 200,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'reference_type_formatted',
        className: 'transaction_type',
        width: 125 ,
      },
      {
        Header: formatMessage({ id: 'transaction_number' }),
        accessor: 'reference_id',
        className: 'transaction_number',
        width: 100,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'description',
        // width: 145,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(generalLedgerTableRows, 'formatted_credit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'formatted_debit',
        className: 'debit',
        width: getColumnWidth(generalLedgerTableRows, 'formatted_debit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'amount' }),
        accessor: 'formatted_amount',
        className: 'amount',
        width: getColumnWidth(generalLedgerTableRows, 'formatted_amount', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'running_balance' }),
        accessor: 'formatted_running_balance',
        className: 'running_balance',
        width: getColumnWidth(generalLedgerTableRows, 'formatted_running_balance', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
    ],
    [formatMessage, generalLedgerTableRows],
  );

  // Default expanded rows of general ledger table.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(generalLedgerTableRows, 1),
    [generalLedgerTableRows],
  );

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'general_ledger_sheet' })}
      fromDate={generalLedgerQuery.from_date}
      toDate={generalLedgerQuery.to_date}
      name="general-ledger"
      loading={generalLedgerSheetLoading}
      fullWidth={true}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        noResults={formatMessage({
          id: 'this_report_does_not_contain_any_data_between_date_period',
        })}
        columns={columns}
        data={generalLedgerTableRows}
        rowClassNames={rowClassNames}
        expanded={expandedRows}
        virtualizedRows={true}
        fixedItemSize={30}
        fixedSizeHeight={1000}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
      />
    </FinancialSheet>
  );
}

export default compose(
  withGeneralLedger(
    ({
      generalLedgerTableRows,
      generalLedgerSheetLoading,
      generalLedgerQuery,
    }) => ({
      generalLedgerTableRows,
      generalLedgerSheetLoading,
      generalLedgerQuery,
    }),
  ),
)(GeneralLedgerTable);
