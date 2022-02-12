import React, { useCallback, useState } from 'react';
import moment from 'moment';

import { FinancialStatement } from 'components';
import GeneralLedgerHeader from './GeneralLedgerHeader';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';
import { GeneralLedgerProvider } from './GeneralLedgerProvider';
import {
  GeneralLedgerSheetAlerts,
  GeneralLedgerSheetLoadingBar,
} from './components';
import { GeneralLedgerBody } from './GeneralLedgerBody';

import withGeneralLedgerActions from './withGeneralLedgerActions';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';
import { compose } from 'utils';
import { getDefaultGeneralLedgerQuery } from './common';

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedger({
  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultGeneralLedgerQuery(),
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
        <FinancialStatement>
          <GeneralLedgerHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <GeneralLedgerSheetLoadingBar />
          <GeneralLedgerSheetAlerts />
          <GeneralLedgerBody />
        </FinancialStatement>
      </DashboardPageContent>
    </GeneralLedgerProvider>
  );
}

export default compose(withGeneralLedgerActions)(GeneralLedger);
