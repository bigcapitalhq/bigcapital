import React, {useCallback, useMemo} from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import {
  getFinancialSheetIndexByQuery,
} from 'store/financialStatement/financialStatements.selectors';

import withTrialBalance from './withTrialBalance';

import { compose } from 'utils';


function TrialBalanceSheetTable({
  // #withTrialBalanceDetail
  trialBalanceAccounts,

  // #withTrialBalanceTable
  trialBalanceIndex,
  trialBalanceQuery,

  onFetchData,
  loading,
  companyName,
}) {

  const {formatMessage} =useIntl();

  const columns = useMemo(() => [
    {
      Header: formatMessage({ id:'account_name' }),
      accessor: 'name',
      className: "name",
    },
    {
      Header: formatMessage({ id:'code' }), 
      accessor: 'code',
      className: "code",
      width: 120,
    },
    {
      Header: formatMessage({ id:'credit' }),
      accessor: r => (<Money amount={r.credit} currency="USD" />),
      className: 'credit',
      width: 120,
    },
    {
      Header: formatMessage({ id:'debit' }),
      accessor: r => (<Money amount={r.debit} currency="USD" />),
      className: 'debit',
      width: 120,
    },
    {
      Header: formatMessage({ id:'balance' }),
      accessor: r => (<Money amount={r.balance} currency="USD" />),
      className: 'balance',
      width: 120,
    }
  ], [formatMessage]);

  const handleFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={'Trial Balance Sheet'}
      fromDate={trialBalanceQuery.from_date}
      toDate={trialBalanceQuery.to_date}
      name="trial-balance"
      loading={loading}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={trialBalanceAccounts}
        onFetchData={handleFetchData}
        expandable={true}
        expandToggleColumn={1} />
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
  withTrialBalance(({ trialBalanceAccounts }) => ({
    trialBalanceAccounts,
  })),
)(TrialBalanceSheetTable);