import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/APAgingSummary.scss';

import { FinancialStatement } from 'components';

import APAgingSummaryHeader from './APAgingSummaryHeader';
import APAgingSummaryActionsBar from './APAgingSummaryActionsBar';
import APAgingSummaryTable from './APAgingSummaryTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';
import { APAgingSummarySheetLoadingBar } from './components';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';
import withAPAgingSummaryActions from './withAPAgingSummaryActions';
import { compose } from 'utils';

/**
 * A/P aging summary report.
 */
function APAgingSummary({
  // #withSettings
  organizationName,

  // #withAPAgingSummaryActions
  toggleAPAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    agingDaysBefore: 30,
    agingPeriods: 3,
    vendorsIds: [],
    filterByOption: 'without-zero-balance',
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

  // Hide the report filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <APAgingSummaryProvider filter={filter}>
      <APAgingSummaryActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <APAgingSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement name={'AP-aging-summary'}>
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
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization?.name,
  })),
  withAPAgingSummaryActions,
)(APAgingSummary);
