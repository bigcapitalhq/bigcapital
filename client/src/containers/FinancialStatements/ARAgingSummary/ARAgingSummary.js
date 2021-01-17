import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { queryCache, useQuery } from 'react-query';
import moment from 'moment';

import { FinancialStatement } from 'components';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ARAgingSummaryActionsBar from './ARAgingSummaryActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ARAgingSummaryHeader from './ARAgingSummaryHeader';
import ReceivableAgingSummaryTable from './ARAgingSummaryTable';

import withSettings from 'containers/Settings/withSettings';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withARAgingSummaryActions from './withARAgingSummaryActions';
import withARAgingSummary from './withARAgingSummary';

import { compose } from 'utils';
import { transfromFilterFormToQuery } from './common';

import 'style/pages/FinancialStatements/ARAgingSummary.scss';

/**
 * AR aging summary report.
 */
function ReceivableAgingSummarySheet({
  // #withSettings
  organizationName,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withARAgingSummaryActions
  requestReceivableAgingSummary,
  refreshARAgingSummary,
  toggleFilterARAgingSummary,

  // #withARAgingSummary
  ARAgingSummaryRefresh,
}) {
  const { formatMessage } = useIntl();
  const [query, setQuery] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingBeforeDays: 30,
    agingPeriods: 3,
  });

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receivable_aging_summary' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    if (ARAgingSummaryRefresh) {
      queryCache.invalidateQueries('receivable-aging-summary');
      refreshARAgingSummary(false);
    }
  }, [ARAgingSummaryRefresh, refreshARAgingSummary]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [setDashboardBackLink]);

  // Handle fetching receivable aging summary report.
  const fetchARAgingSummarySheet = useQuery(
    ['receivable-aging-summary', query],
    (key, q) =>
      requestReceivableAgingSummary({
        ...transfromFilterFormToQuery(q),
      }),
    { manual: true },
  );

  // Handle fetch the data of receivable aging summary sheet.
  const handleFetchData = useCallback((...args) => {}, []);

  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        asDate: moment(filter.asDate).format('YYYY-MM-DD'),
      };
      setQuery(_filter);
      refreshARAgingSummary(true);
      toggleFilterARAgingSummary(false);
    },
    [refreshARAgingSummary, toggleFilterARAgingSummary],
  );

  return (
    <DashboardInsider>
      <ARAgingSummaryActionsBar />

      <DashboardPageContent>
        <FinancialStatement>
          <ARAgingSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <ReceivableAgingSummaryTable
              organizationName={organizationName}
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
  withARAgingSummaryActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withARAgingSummary(({ ARAgingSummaryRefresh }) => ({
    ARAgingSummaryRefresh: ARAgingSummaryRefresh,
  })),
)(ReceivableAgingSummarySheet);
