import React, { useEffect, useState, useMemo } from 'react';
import TrialBalanceSheetHeader from "./TrialBalanceSheetHeader";
import LoadingIndicator from 'components/LoadingIndicator';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';
import { useAsync } from 'react-use';
import moment from 'moment';
import {compose} from 'utils';
import TrialBalanceSheetConnect from 'connectors/TrialBalanceSheet.connect';
import DashboardConnect from 'connectors/Dashboard.connector';

function TrialBalanceSheet({
  changePageTitle,
  fetchTrialBalanceSheet,
  getTrialBalanceSheetIndex,
  getTrialBalanceAccounts,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    none_zero: false,
  });
  const [reload, setReload] = useState(false);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchTrialBalanceSheet(),
    ]);
  });

  // Retrieve balance sheet index by the given filter query.
  const trialBalanceSheetIndex = useMemo(() => {
    return getTrialBalanceSheetIndex(filter);
  }, [getTrialBalanceSheetIndex, filter]);

  // Retrieve balance sheet accounts bu the given sheet index.
  const trialBalanceAccounts = useMemo(() => {
    return getTrialBalanceAccounts(trialBalanceSheetIndex);
  }, [trialBalanceSheetIndex]);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Trial Balance Sheet');
  }, []);

  const handleFilterSubmit = (filter) => {
    setFilter({
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    });
    setReload(true);
  };

  return (
    <div class="financial-statement">
      <TrialBalanceSheetHeader
        pageFilter={filter}
        onSubmitFilter={handleFilterSubmit} />

      <div class="financial-statement__body">
        <LoadingIndicator loading={fetchHook.pending}>
          <TrialBalanceSheetTable
            trialBalanceSheetAccounts={trialBalanceAccounts}
            trialBalanceSheetIndex={trialBalanceSheetIndex} />
        </LoadingIndicator>
      </div>
    </div>
  )
}

export default compose(
  DashboardConnect,
  TrialBalanceSheetConnect,
)(TrialBalanceSheet);