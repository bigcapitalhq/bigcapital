import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withTrialBalance from './withTrialBalance';

import { compose, getColumnWidth } from 'utils';

function TrialBalanceSheetTable({
  // #withTrialBalanceDetail
  trialBalanceTableRows,
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
        width: 160,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(trialBalanceTableRows, `credit`, {
          minWidth: 95,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'formatted_debit',
        width: getColumnWidth(trialBalanceTableRows, `debit`, { minWidth: 95 }),
      },
      {
        Header: formatMessage({ id: 'balance' }),
        accessor: 'formatted_balance',
        className: 'balance',
        width: getColumnWidth(trialBalanceTableRows, `balance`, {
          minWidth: 95,
        }),
      },
    ],
    [trialBalanceTableRows, formatMessage],
  );

  const rowClassNames = (row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowTypes) ? original.rowTypes : [];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  };

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
        data={trialBalanceTableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={rowClassNames}
      />
    </FinancialSheet>
  );
}

export default compose(
  withTrialBalance(
    ({
      trialBalanceTableRows,
      trialBalanceSheetLoading,
      trialBalanceQuery,
    }) => ({
      trialBalanceTableRows,
      trialBalanceSheetLoading,
      trialBalanceQuery,
    }),
  ),
)(TrialBalanceSheetTable);
