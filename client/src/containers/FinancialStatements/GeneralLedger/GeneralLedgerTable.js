import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { defaultExpanderReducer, compose } from 'utils';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import { getFinancialSheetIndexByQuery } from 'store/financialStatement/financialStatements.selectors';
import withGeneralLedger from './withGeneralLedger';

const ROW_TYPE = {
  CLOSING_BALANCE: 'closing_balance',
  OPENING_BALANCE: 'opening_balance',
  ACCOUNT: 'account_name',
  TRANSACTION: 'transaction',
};

function GeneralLedgerTable({
  companyName,
  onFetchData,

  generalLedgerSheetLoading,
  generalLedgerTableRows,
  generalLedgerQuery,
}) {
  const { formatMessage } = useIntl();

  // Account name column accessor.
  const accountNameAccessor = useCallback(
    (row) => {
      switch (row.rowType) {
        case ROW_TYPE.OPENING_BALANCE:
          return 'Opening Balance';
        case ROW_TYPE.CLOSING_BALANCE:
          return 'Closing Balance';
        default:
          return row.name;
      }
    },
    [ROW_TYPE],
  );

  // Date accessor.
  const dateAccessor = useCallback(
    (row) => {
      const TYPES = [
        ROW_TYPE.OPENING_BALANCE,
        ROW_TYPE.CLOSING_BALANCE,
        ROW_TYPE.TRANSACTION,
      ];

      return TYPES.indexOf(row.rowType) !== -1
        ? moment(row.date).format('DD-MM-YYYY')
        : '';
    },
    [moment, ROW_TYPE],
  );

  // Amount cell
  const amountCell = useCallback(({ cell }) => {
    const transaction = cell.row.original;

    if (transaction.rowType === ROW_TYPE.ACCOUNT) {
      return !cell.row.isExpanded ? (
        <Money amount={transaction.closing.amount} currency={'USD'} />
      ) : (
        ''
      );
    }
    return <Money amount={transaction.amount} currency={'USD'} />;
  }, []);

  const referenceLink = useCallback((row) => {
    return <a href="">{row.referenceId}</a>;
  });

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: accountNameAccessor,
        className: 'name',
      },
      {
        Header: formatMessage({ id: 'date' }),
        accessor: dateAccessor,
        className: 'date',
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'referenceType',
        className: 'transaction_type',
      },
      {
        Header: formatMessage({ id: 'trans_num' }),
        accessor: referenceLink,
        className: 'transaction_number',
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'description',
      },
      {
        Header: formatMessage({ id: 'amount' }),
        Cell: amountCell,
        className: 'amount',
      },
      {
        Header: formatMessage({ id: 'balance' }),
        Cell: amountCell,
        className: 'balance',
      },
    ],
    [],
  );

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

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
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        noResults={formatMessage({
          id: 'this_report_does_not_contain_any_data_between_date_period',
        })}
        columns={columns}
        data={generalLedgerTableRows}
        onFetchData={handleFetchData}
        rowClassNames={rowClassNames}
        expanded={expandedRows}
        virtualizedRows={true}
        fixedItemSize={37}
        fixedSizeHeight={1000}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
      />
    </FinancialSheet>
  );
}

const mapStateToProps = (state, props) => {
  const { generalLedgerQuery } = props;

  return {
    generalLedgerIndex: getFinancialSheetIndexByQuery(
      state.financialStatements.generalLedger.sheets,
      generalLedgerQuery,
    ),
  };
};

const withGeneralLedgerTable = connect(mapStateToProps);

export default compose(
  withGeneralLedgerTable,
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
