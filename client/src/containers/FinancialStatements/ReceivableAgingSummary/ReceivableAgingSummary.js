import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import moment from 'moment';
import { FinancialStatement } from 'components';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ReceivableAgingSummaryActionsBar from './ReceivableAgingSummaryActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ReceivableAgingSummaryHeader from './ReceivableAgingSummaryHeader'
import ReceivableAgingSummaryTable from './ReceivableAgingSummaryTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withReceivableAgingSummaryActions from './withReceivableAgingSummaryActions';
import { compose } from 'utils';


function ReceivableAgingSummarySheet({
  // #withDashboardActions
  changePageTitle,

  // #withReceivableAgingSummaryActions
  requestReceivableAgingSummary,
}) {
  const { formatMessage } = useIntl();
  const [query, setQuery] = useState({
    as_date: moment().format('YYYY-MM-DD'),
    aging_before_days: 30,
    aging_periods: 3,
  });

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receivable_aging_summary' }));
  }, []);

  const fetchSheet = useQuery(['receivable-aging-summary', query], 
    (key, q) => requestReceivableAgingSummary(q),
    { manual: true });

  // Handle fetch the data of receivable aging summary sheet.
  const handleFetchData = useCallback(() => {
    fetchSheet.refetch({ force: true });
  }, [fetchSheet]);

  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      as_date: moment(filter.as_date).format('YYYY-MM-DD'),
    };
    setQuery(_filter);
    fetchSheet.refetch({ force: true });
  }, [fetchSheet]);

  return (
    <DashboardInsider>
      <ReceivableAgingSummaryActionsBar />
 
      <DashboardPageContent>
        <FinancialStatement>
          <ReceivableAgingSummaryHeader
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__body">
            <ReceivableAgingSummaryTable
              receivableAgingSummaryQuery={query}
              onFetchData={handleFetchData}
            />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withReceivableAgingSummaryActions
)(ReceivableAgingSummarySheet);