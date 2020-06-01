import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';

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
  balanceSheetColumns,
  balanceSheetQuery,

  // #ownProps
  onFetchData,
  loading,
}) {
  const { formatMessage } = useIntl();
  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'account_name',
      },
      {
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
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
              className: 'credit',
            },
          ]
        : []),
      ...(balanceSheetQuery.display_columns_type === 'date_periods'
        ? balanceSheetColumns.map((column, index) => ({
            id: `date_period_${index}`,
            Header: column,
            accessor: (row) => {
              if (row.total_periods && row.total_periods[index]) {
                const amount = row.total_periods[index].formatted_amount;
                return <Money amount={amount} currency={'USD'} />;
              }
              return '';
            },
            width: 100,
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
    () => defaultExpanderReducer(balanceSheetAccounts, 1),
    [balanceSheetAccounts],
  );

  return (
    <FinancialSheet
      companyName={organizationSettings.name}
      sheetType={formatMessage({ id: 'balance_sheet' })}
      fromDate={balanceSheetQuery.from_date}
      toDate={balanceSheetQuery.to_date}
      basis={balanceSheetQuery.basis}
      loading={loading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={balanceSheetAccounts}
        onFetchData={handleFetchData}
        expanded={expandedRows}
        expandSubRows={true}
        sticky={true}
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
    ({ balanceSheetAccounts, balanceSheetColumns, balanceSheetQuery }) => ({
      balanceSheetAccounts,
      balanceSheetColumns,
      balanceSheetQuery,
    }),
  ),
  withSettings,
)(BalanceSheetTable);
