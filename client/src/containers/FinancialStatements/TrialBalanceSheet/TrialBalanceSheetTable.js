import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import { getFinancialSheetIndexByQuery } from 'store/financialStatement/financialStatements.selectors';

import withTrialBalance from './withTrialBalance';

import { compose } from 'utils';

function TrialBalanceSheetTable({
  // #withTrialBalanceDetail
  trialBalanceAccounts,
  trialBalanceSheetLoading,

  // #withTrialBalanceTable
  trialBalanceIndex,
  trialBalanceQuery,

  onFetchData,
  companyName,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'name',
        minWidth: 150,
        maxWidth: 150,
        width: 150,
      },
      {
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        minWidth: 80,
        maxWidth: 80,
        width: 80,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'credit',
        Cell: ({ cell }) => <Money amount={cell.row.original.credit} currency="USD" />,
        className: 'credit',
        minWidth: 95,
        maxWidth: 95,
        width: 95,
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'debit',
        Cell: ({ cell }) => <Money amount={cell.row.original.debit} currency="USD" />,
        className: 'debit',
        minWidth: 95,
        maxWidth: 95,
        width: 95,
      },
      {
        Header: formatMessage({ id: 'balance' }),
        accessor: 'balance',
        Cell: ({ cell }) => <Money amount={cell.row.original.balance} currency="USD" />,
        className: 'balance',
        minWidth: 95,
        maxWidth: 95,
        width: 95,
      },
    ],
    [formatMessage],
  );

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'trial_balance_sheet' })}
      fromDate={trialBalanceQuery.from_date}
      toDate={trialBalanceQuery.to_date}
      name="trial-balance"
      loading={trialBalanceSheetLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={trialBalanceAccounts}
        onFetchData={handleFetchData}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
      />
    </FinancialSheet>
  );
}

const mapStateToProps = (state, props) => {
  const { trialBalanceQuery } = props;
  return {
    trialBalanceIndex: getFinancialSheetIndexByQuery(
      state.financialStatements.trialBalance.sheets,
      trialBalanceQuery,
    ),
  };
};

const withTrialBalanceTable = connect(mapStateToProps);

export default compose(
  withTrialBalanceTable,
  withTrialBalance(({
    trialBalanceAccounts,
    trialBalanceSheetLoading,
  }) => ({
    trialBalanceAccounts,
    trialBalanceSheetLoading
  })),
)(TrialBalanceSheetTable);
