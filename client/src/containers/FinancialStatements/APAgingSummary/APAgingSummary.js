import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { queryCache, useQuery } from 'react-query';
import moment from 'moment';

import { FinancialStatement } from 'components';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import APAgingSummaryActionsBar from './APAgingSummaryActionsBar';
import APAgingSummaryHeader from './APAgingSummaryHeader';
import APAgingSummaryTable from './APAgingSummaryTable';

import withSettings from 'containers/Settings/withSettings';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAPAgingSummaryActions from './withAPAgingSummaryActions';
import withAPAgingSummary from './withAPAgingSummary';
import { transformFilterFormToQuery } from './common';

import { compose } from 'utils';

import 'style/pages/FinancialStatements/ARAgingSummary.scss';

/**
 * AP aging summary report.
 */
function APAgingSummary({
  // #withSettings
  organizationName,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withAPAgingSummary
  APAgingSummaryRefresh,

  // #withAPAgingSummaryActions
  requestPayableAgingSummary,
  refreshAPAgingSummary,
  toggleFilterAPAgingSummary,
}) {
  const { formatMessage } = useIntl();

  const [query, setQuery] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingBeforeDays: 30,
    agingPeriods: 3,
  });

  // handle fetching payable aging summary report.
  const fetchAPAgingSummarySheet = useQuery(
    ['payable-aging-summary', query],
    (key, _query) =>
      requestPayableAgingSummary({
        ...transformFilterFormToQuery(_query),
      }),
    { enable: true },
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'payable_aging_summary' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    if (APAgingSummaryRefresh) {
      queryCache.invalidateQueries('payable-aging-summary');
      refreshAPAgingSummary(false);
    }
  }, [APAgingSummaryRefresh, refreshAPAgingSummary]);

  useEffect(() => {
    setDashboardBackLink(true);
    return () => {
      setDashboardBackLink(false);
    };
  }, [setDashboardBackLink]);

  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setQuery(_filter);
    refreshAPAgingSummary(true);
    toggleFilterAPAgingSummary(false);
  };

  const handleNumberFormatSubmit = (numberFormat) => {
    setQuery({
      ...query,
      numberFormat,
    });
    refreshAPAgingSummary(true);
  };

  return (
    <DashboardInsider>
      <APAgingSummaryActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <DashboardPageContent>
        <FinancialStatement>
          <APAgingSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <div className={'financial-statement__body'}>
            <APAgingSummaryTable organizationName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withAPAgingSummaryActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withAPAgingSummary(({ APAgingSummaryRefresh }) => ({
    APAgingSummaryRefresh,
  })),
)(APAgingSummary);
