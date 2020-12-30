import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { defaultExpanderReducer, compose } from 'utils';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withGeneralLedger from './withGeneralLedger';

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

  // Account name column accessor.
  const accountNameAccessor = (row) => {
    switch (row.rowType) {
      case ROW_TYPE.OPENING_BALANCE:
        return 'Opening Balance';
      case ROW_TYPE.CLOSING_BALANCE:
        return 'Closing Balance';
      default:
        return row.name;
    }
  };

  // Date accessor.
  const dateAccessor = (row) => {
    const TYPES = [
      ROW_TYPE.OPENING_BALANCE,
      ROW_TYPE.CLOSING_BALANCE,
      ROW_TYPE.TRANSACTION,
    ];

    return TYPES.indexOf(row.rowType) !== -1
      ? moment(row.date).format('DD MMM YYYY')
      : '';
  };

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

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: accountNameAccessor,
        className: 'name',
        width: 225,
      },
      {
        Header: formatMessage({ id: 'date' }),
        accessor: dateAccessor,
        className: 'date',
        width: 115,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'referenceType',
        className: 'transaction_type',
        width: 145,
      },
      {
        Header: formatMessage({ id: 'trans_num' }),
        accessor: 'reference_id',
        className: 'transaction_number',
        width: 110,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'description',
        width: 145,
      },
      {
        Header: formatMessage({ id: 'amount' }),
        Cell: amountCell,
        className: 'amount',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'balance' }),
        Cell: amountCell,
        className: 'balance',
        width: 150,
      },
    ],
    [],
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
        fixedItemSize={37}
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
