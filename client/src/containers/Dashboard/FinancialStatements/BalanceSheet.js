import React, {useEffect} from 'react';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import useAsync from 'hooks/async';
import FinancialStatementConnect from 'connectors/FinancialStatements.connector';
import {useIntl} from 'react-intl';
import BalanceSheetHeader from './BalanceSheet/BalanceSheetHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import BalanceSheetTable from './BalanceSheet/BalanceSheetTable';

function BalanceSheet({
  fetchBalanceSheet,
  changePageTitle,
}) {
  const intl = useIntl();
  const handleDateChange = () => {};

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchBalanceSheet({}),
    ]);
  });

  useEffect(() => { 
    changePageTitle('Balance Sheet');
  }, []);

  const handleFilterSubmit = (filter) => {

  };

  return (
    <div class="financial-statement">
      <BalanceSheetHeader onSubmitFilter={handleFilterSubmit} />

      <div class="financial-statement__body">
        <LoadingIndicator loading={fetchHook.pending}>
          <BalanceSheetTable />
        </LoadingIndicator>
      </div>
    </div>
  );
}

export default compose(
  DashboardConnect,
  FinancialStatementConnect,
)(BalanceSheet);