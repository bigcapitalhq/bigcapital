import React, { useEffect, useCallback, useState, useMemo } from 'react';
import TrialBalanceSheetHeader from "./TrialBalanceSheetHeader";
import LoadingIndicator from 'components/LoadingIndicator';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';
import useAsync from 'hooks/async';
import moment from 'moment';
import {compose} from 'utils';
import TrialBalanceSheetConnect from 'connectors/TrialBalanceSheet.connect';
import DashboardConnect from 'connectors/Dashboard.connector';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';


function TrialBalanceSheet({
  changePageTitle,
  fetchTrialBalanceSheet,
  getTrialBalanceSheetIndex,
  getTrialBalanceAccounts,
  trialBalanceSheetLoading,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    none_zero: false,
  });

  const fetchHook = useAsync((query = filter) => {
    return Promise.all([
      fetchTrialBalanceSheet(query),
    ]);
  }, false);

  // handle fetch data of trial balance table.
  const handleFetchData = useCallback(() => { fetchHook.execute() }, [fetchHook]);

  // Retrieve balance sheet index by the given filter query.
  const trialBalanceSheetIndex = useMemo(() => 
    getTrialBalanceSheetIndex(filter),
    [getTrialBalanceSheetIndex, filter]);

  // Retrieve balance sheet accounts bu the given sheet index.
  const trialBalanceAccounts = useMemo(() =>
    getTrialBalanceAccounts(trialBalanceSheetIndex),
    [getTrialBalanceAccounts, trialBalanceSheetIndex]);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Trial Balance Sheet');
  }, []);

  const handleFilterSubmit = useCallback((filter) => {
    const parsedFilter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(parsedFilter);
    fetchHook.execute(parsedFilter);
  }, [setFilter, fetchHook]);

  return (
    <DashboardInsider>
      <TrialBalanceActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__body">
            <TrialBalanceSheetTable
              trialBalanceSheetAccounts={trialBalanceAccounts}
              trialBalanceSheetIndex={trialBalanceSheetIndex}
              onFetchData={handleFetchData}
              loading={trialBalanceSheetLoading} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  DashboardConnect,
  TrialBalanceSheetConnect,
)(TrialBalanceSheet);