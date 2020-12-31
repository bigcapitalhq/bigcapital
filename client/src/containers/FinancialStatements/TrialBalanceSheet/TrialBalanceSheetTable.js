import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withTrialBalance from './withTrialBalance';

import { compose } from 'utils';

function TrialBalanceSheetTable({
  // #withTrialBalanceDetail
  trialBalance,
  trialBalanceSheetLoading,

  // #withTrialBalanceTable
  trialBalanceQuery,

  companyName,
}) {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        minWidth: 150,
        maxWidth: 150,
        width: 150,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'credit',
        Cell: ({ cell }) => {
          const { currency_code, credit } = cell.row.original;
          return (<Money amount={credit} currency={currency_code} />);
        },
        className: 'credit',
        width: 95,
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'debit',
        Cell: ({ cell }) => {
          const { currency_code, debit } = cell.row.original;
          return (<Money amount={debit} currency={currency_code} />);
        },
        className: 'debit',
        width: 95,
      },
      {
        Header: formatMessage({ id: 'balance' }),
        accessor: 'balance',
        Cell: ({ cell }) => {
          const { currency_code, balance } = cell.row.original;
          return (<Money amount={balance} currency={currency_code} />);
        },
        className: 'balance',
        width: 95,
      },
    ],
    [formatMessage],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'trial_balance_sheet' })}
      fromDate={trialBalanceQuery.from_date}
      toDate={trialBalanceQuery.to_date}
      name="trial-balance"
      loading={trialBalanceSheetLoading}
      basis={'cash'}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={trialBalance.data}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
      />
    </FinancialSheet>
  );
}

export default compose(
  withTrialBalance(({
    trialBalance,
    trialBalanceSheetLoading,
    trialBalanceQuery
  }) => ({
    trialBalance,
    trialBalanceSheetLoading,
    trialBalanceQuery
  })),
)(TrialBalanceSheetTable);
