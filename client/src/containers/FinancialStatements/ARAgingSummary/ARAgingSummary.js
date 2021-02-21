import React, { useState, useCallback } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/ARAgingSummary.scss';

import { FinancialStatement } from 'components';

import ARAgingSummaryHeader from './ARAgingSummaryHeader';
import ARAgingSummaryActionsBar from './ARAgingSummaryActionsBar';
import ARAgingSummaryTable from './ARAgingSummaryTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { ARAgingSummaryProvider } from './ARAgingSummaryProvider';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

/**
 * AR aging summary report.
 */
function ReceivableAgingSummarySheet({
  // #withSettings
  organizationName,
}) {
  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
  });

  // Handle filter submit.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  }, []);

  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({ ...filter, numberFormat });
  };

  return (
    <ARAgingSummaryProvider filter={filter}>
      <ARAgingSummaryActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <DashboardPageContent>
        <FinancialStatement>
          <ARAgingSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <ARAgingSummaryTable organizationName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </ARAgingSummaryProvider>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(ReceivableAgingSummarySheet);
