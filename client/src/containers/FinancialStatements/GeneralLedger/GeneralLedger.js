import React, { useCallback, useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/GeneralLedger.scss';

import GeneralLedgerTable from './GeneralLedgerTable';
import GeneralLedgerHeader from './GeneralLedgerHeader';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';
import { GeneralLedgerProvider } from './GeneralLedgerProvider';
import {
  GeneralLedgerSheetAlerts,
  GeneralLedgerSheetLoadingBar,
} from './components';

import withGeneralLedgerActions from './withGeneralLedgerActions';
import withSettings from 'containers/Settings/withSettings';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';
import { compose } from 'utils';

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedger({
  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer,

  // #withSettings
  organizationName,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    accountsFilter: 'with-transactions',
  });

  // Handle financial statement filter change.
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

  // Hide the filter drawer once the page unmount.
  React.useEffect(
    () => () => {
      toggleGeneralLedgerFilterDrawer(false);
    },
    [toggleGeneralLedgerFilterDrawer],
  );

  return (
    <GeneralLedgerProvider query={transformFilterFormToQuery(filter)}>
      <GeneralLedgerActionsBar />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--general-ledger">
          <GeneralLedgerHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <GeneralLedgerSheetLoadingBar />
          <GeneralLedgerSheetAlerts />

          <div class="financial-statement__body">
            <GeneralLedgerTable
              companyName={organizationName}
              generalLedgerQuery={filter}
            />
          </div>
        </div>
      </DashboardPageContent>
    </GeneralLedgerProvider>
  );
}

export default compose(
  withGeneralLedgerActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(GeneralLedger);
