import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import Money from 'components/Money';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';

import withSettings from 'containers/Settings/withSettings';
import withBalanceSheetDetail from './withBalanceSheetDetail';
import { getFinancialSheetIndexByQuery } from 'store/financialStatement/financialStatements.selectors';

import { compose, defaultExpanderReducer } from 'utils';

function BalanceSheetTable({
  // #withPreferences
  organizationSettings,

  // #withBalanceSheetDetail
  balanceSheetAccounts,
  balanceSheetTableRows,
  balanceSheetColumns,
  balanceSheetQuery,
  balanceSheetLoading,

  // #ownProps
  onFetchData,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'account_name',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        width: 60,
      },
      ...(balanceSheetQuery.display_columns_type === 'total'
        ? [
            {
              Header: formatMessage({ id: 'total' }),
              accessor: 'balance.formatted_amount',
              Cell: ({ cell }) => {
                const row = cell.row.original;
                if (row.total) {
                  return (
                    <Money
                      amount={row.total.formatted_amount}
                      currency={'USD'}
                    />
                  );
                }
                return '';
              },
              className: 'total',
              width: 80,
            },
          ]
        : []),
      ...(balanceSheetQuery.display_columns_type === 'date_periods'
        ? balanceSheetColumns.map((column, index) => ({
            id: `date_period_${index}`,
            Header: column,
            accessor: `total_periods[${index}]`,
            Cell: ({ cell }) => {
              const { original } = cell.row;
              if (original.total_periods && original.total_periods[index]) {
                const amount = original.total_periods[index].formatted_amount;
                return <Money amount={amount} currency={'USD'} />;
              }
              return '';
            },
            className: classNames('total-period', `total-periods-${index}`),
            width: 80,
          }))
        : []),
    ],
  [balanceSheetQuery, balanceSheetColumns, formatMessage],
  );

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  // Calculates the default expanded rows of balance sheet table.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(balanceSheetTableRows, 3),
    [balanceSheetTableRows],
  );

  const rowClassNames = (row) => {
    const { original } = row;
    console.log(row);
    return {
      [`row_type--${original.row_type}`]: original.row_type,
    };
  };

  return (
    <FinancialSheet
      name="balance-sheet"
      companyName={organizationSettings.name}
      sheetType={formatMessage({ id: 'balance_sheet' })}
      fromDate={balanceSheetQuery.from_date}
      toDate={balanceSheetQuery.to_date}
      basis={balanceSheetQuery.basis}
      loading={balanceSheetLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={balanceSheetTableRows}
        rowClassNames={rowClassNames}
        onFetchData={handleFetchData}
        noInitialFetch={true}
        expanded={expandedRows}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
        expandColumnSpace={0.8}
      />
    </FinancialSheet>
  );
}

const mapStateToProps = (state, props) => {
  const { balanceSheetQuery } = props;
  return {
    balanceSheetIndex: getFinancialSheetIndexByQuery(
      state.financialStatements.balanceSheet.sheets,
      balanceSheetQuery,
    ),
  };
};

const withBalanceSheetTable = connect(mapStateToProps);

export default compose(
  withBalanceSheetTable,
  withBalanceSheetDetail(
    ({
      balanceSheetAccounts,
      balanceSheetTableRows,
      balanceSheetColumns,
      balanceSheetQuery,
      balanceSheetLoading,
    }) => ({
      balanceSheetAccounts,
      balanceSheetTableRows,
      balanceSheetColumns,
      balanceSheetQuery,
      balanceSheetLoading,
    }),
  ),
  withSettings,
)(BalanceSheetTable);
