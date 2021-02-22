import React, { useState, useCallback } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/ARAgingSummary.scss';

import { FinancialStatement } from 'components';

import APAgingSummaryHeader from './APAgingSummaryHeader';
import APAgingSummaryActionsBar from './APAgingSummaryActionsBar';
import APAgingSummaryTable from './APAgingSummaryTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

/**
 * AP aging summary report.
 */
function APAgingSummary({
  // #withSettings
  organizationName,
}) {
  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingBeforeDays: 30,
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
    setFilter({
      ...filter,
      numberFormat,
    });
  };

  return (
    <APAgingSummaryProvider filter={filter}>
      <APAgingSummaryActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <DashboardPageContent>
        <FinancialStatement>
          <APAgingSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div className={'financial-statement__body'}>
            <APAgingSummaryTable organizationName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </APAgingSummaryProvider>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings?.name,
  })),
)(APAgingSummary);
