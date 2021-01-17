import React, { useEffect, useCallback, useState } from 'react';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { queryCache } from 'react-query';

import GeneralLedgerTable from 'containers/FinancialStatements/GeneralLedger/GeneralLedgerTable';
import GeneralLedgerHeader from './GeneralLedgerHeader';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';

import withGeneralLedgerActions from './withGeneralLedgerActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';
import withGeneralLedger from './withGeneralLedger';

import 'style/pages/FinancialStatements/GeneralLedger.scss';

/**
 * General Ledger (GL) sheet.
 */
function GeneralLedger({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withGeneralLedgerActions
  fetchGeneralLedger,
  refreshGeneralLedgerSheet,

  // #withAccountsActions
  requestFetchAccounts,

  // #withGeneralLedger
  generalLedgerSheetRefresh,

  // #withSettings
  organizationName,
}) {
  const { formatMessage } = useIntl();
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
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

  // Observes the GL sheet refresh to invalid the query to refresh it.
  useEffect(() => {
    if (generalLedgerSheetRefresh) {
      queryCache.invalidateQueries('general-ledger');
      refreshGeneralLedgerSheet(false);
    }
  }, [generalLedgerSheetRefresh, refreshGeneralLedgerSheet]);

  // Fetches accounts list.
  const fetchAccounts = useQuery(['accounts-list'], () =>
    requestFetchAccounts(),
  );
  // Fetches the general ledger sheet.
  const fetchSheet = useQuery(['general-ledger', filter], (key, q) =>
    fetchGeneralLedger({ ...transformFilterFormToQuery(q) }),
  );

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
    <DashboardInsider>
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
    </DashboardInsider>
  );
}

export default compose(
  withGeneralLedgerActions,
  withDashboardActions,
  withAccountsActions,
  withGeneralLedger(({ generalLedgerSheetRefresh }) => ({
    generalLedgerSheetRefresh,
  })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(GeneralLedger);
