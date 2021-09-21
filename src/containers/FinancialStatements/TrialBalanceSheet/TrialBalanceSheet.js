import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/TrialBalanceSheet.scss';

import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import {
  TrialBalanceSheetAlerts,
  TrialBalanceSheetLoadingBar,
} from './components';

import withTrialBalanceActions from './withTrialBalanceActions';
import withCurrentOrganization from '../../Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Trial balance sheet.
 */
function TrialBalanceSheet({
  // #withPreferences
  organizationName,

  // #withTrialBalanceSheetActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    accountsFilter: 'all-accounts',
  });

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(parsedFilter);
    },
    [setFilter],
  );

  // Handle numebr format form submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({
      ...filter,
      numberFormat,
    });
  };

  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleFilterDrawer(false);
    },
    [toggleFilterDrawer],
  );

  return (
    <TrialBalanceSheetProvider query={filter}>
      <TrialBalanceActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <TrialBalanceSheetLoadingBar />
      <TrialBalanceSheetAlerts />

      <DashboardPageContent>
        <div class="financial-statement">
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <TrialBalanceSheetTable companyName={organizationName} />
          </div>
        </div>
      </DashboardPageContent>
    </TrialBalanceSheetProvider>
  );
}

export default compose(
  withTrialBalanceActions,
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(TrialBalanceSheet);
