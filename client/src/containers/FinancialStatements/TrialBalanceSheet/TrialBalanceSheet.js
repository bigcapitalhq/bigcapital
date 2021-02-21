import React, { useCallback, useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/TrialBalanceSheet.scss';

import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import withTrialBalanceActions from './withTrialBalanceActions';
import withSettings from 'containers/Settings/withSettings';
import withTrialBalance from './withTrialBalance';

import { compose } from 'utils';

/**
 * Trial balance sheet.
 */
function TrialBalanceSheet({
  // #withPreferences
  organizationName,
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

  return (
    <TrialBalanceSheetProvider query={filter}>
      <TrialBalanceActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
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
  withTrialBalance(({ trialBalanceQuery }) => ({
    trialBalanceQuery,
  })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(TrialBalanceSheet);
