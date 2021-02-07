import React, { useEffect, useCallback, useState } from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import 'style/pages/FinancialStatements/GeneralLedger.scss';

import GeneralLedgerTable from './GeneralLedgerTable';
import GeneralLedgerHeader from './GeneralLedgerHeader';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';
import { GeneralLedgerProvider } from './GeneralLedgerProvider';

import withGeneralLedgerActions from './withGeneralLedgerActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedger({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withGeneralLedgerActions
  refreshGeneralLedgerSheet,

  // #withSettings
  organizationName,
}) {
  const { formatMessage } = useIntl();
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    accountsFilter: 'with-transactions',
  });

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'general_ledger' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
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
      refreshGeneralLedgerSheet(true);
    },
    [setFilter, refreshGeneralLedgerSheet],
  );

  return (
    <GeneralLedgerProvider query={filter}>
      <GeneralLedgerActionsBar />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--general-ledger">
          <GeneralLedgerHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />

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
  withDashboardActions,
  withAccountsActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(GeneralLedger);
