// @ts-nocheck
import React, { useEffect } from 'react';
import moment from 'moment';

import {
  ProjectProfitabilitySummaryAlerts,
  ProjectProfitabilitySummaryLoadingBar,
} from './components';
import { FinancialStatement, DashboardPageContent } from '@/components';

import ProjectProfitabilitySummaryHeader from './ProjectProfitabilitySummaryHeader';
import ProjectProfitabilitySummaryActionsBar from './ProjectProfitabilitySummaryActionsBar';
import { ProjectProfitabilitySummaryBody } from './ProjectProfitabilitySummaryBody';
import { ProjectProfitabilitySummaryProvider } from './ProjectProfitabilitySummaryProvider';
import { useProjectProfitabilitySummaryQuery } from './utils';
import withProjectProfitabilitySummaryActions from './withProjectProfitabilitySummaryActions';
import { compose } from '@/utils';

/**
 * Project profitability summary.
 * @returns {React.JSX}
 */
function ProjectProfitabilitySummary({
  // #withProjectProfitabilitySummaryActions
  toggleProjectProfitabilitySummaryFilterDrawer,
}) {
  // Project profitability summary query.
  const { query, setLocationQuery } = useProjectProfitabilitySummaryQuery();

  // Handle refetch project profitability summary filter changer.
  const handleFilterSubmit = (filter) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ...newFilter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setLocationQuery({
      ...query,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => {
      toggleProjectProfitabilitySummaryFilterDrawer(false);
    },
    [toggleProjectProfitabilitySummaryFilterDrawer],
  );

  return (
    <ProjectProfitabilitySummaryProvider filter={query}>
      <ProjectProfitabilitySummaryActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <ProjectProfitabilitySummaryLoadingBar />
      <ProjectProfitabilitySummaryAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <ProjectProfitabilitySummaryHeader
            pageFilter={query}
            onFilterSubmit={handleFilterSubmit}
          />
          <ProjectProfitabilitySummaryBody />
        </FinancialStatement>
      </DashboardPageContent>
    </ProjectProfitabilitySummaryProvider>
  );
}

export default compose(withProjectProfitabilitySummaryActions)(
  ProjectProfitabilitySummary,
);
