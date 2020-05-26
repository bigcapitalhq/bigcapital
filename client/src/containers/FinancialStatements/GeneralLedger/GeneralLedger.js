import React, { useEffect, useCallback, useState} from 'react';
import moment from 'moment';
import GeneralLedgerTable from 'containers/FinancialStatements/GeneralLedger/GeneralLedgerTable';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import GeneralLedgerHeader from './GeneralLedgerHeader';

import { compose } from 'utils';

import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';

import withGeneralLedgerActions from './withGeneralLedgerActions';
import withDashboard from 'containers/Dashboard/withDashboard';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withSettings from 'containers/Settings/withSettings';


function GeneralLedger({
  // #withDashboard
  changePageTitle,

  // #withGeneralLedgerActions
  fetchGeneralLedger,
  
  // #withAccountsActions
  requestFetchAccounts,

  // #withSettings
  organizationSettings,
}) {
  const { formatMessage } = useIntl()
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    none_zero: true,
  });
  const [refetch, setRefetch] = useState(false);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({id:'general_ledger'}));
  }, [changePageTitle,formatMessage]);

  const fetchAccounts = useQuery(['accounts-list'],
    () => requestFetchAccounts());

  const fetchSheet = useQuery(['general-ledger', filter],
    (key, query) => fetchGeneralLedger(query),
    { manual: true });

  // Refetch general ledger sheet effect.
  useEffect(() => {
    if (refetch) {
      fetchSheet.refetch({ force: true });
      setRefetch(false);
    }
  }, [fetchSheet, refetch]);

  // Handle fetch data of trial balance table.
  const handleFetchData = useCallback(() => {
    setRefetch(true);
  }, []);
  
  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const parsedFilter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(parsedFilter);
    setRefetch(true);
  }, [setFilter]);

  const handleFilterChanged = () => { };

  return (
    <DashboardInsider>
      <GeneralLedgerActionsBar
        onFilterChanged={handleFilterChanged} />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--general-ledger">
          <GeneralLedgerHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__table">
            <GeneralLedgerTable
              companyName={organizationSettings.name}
              generalLedgerQuery={filter}
              onFetchData={handleFetchData} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withGeneralLedgerActions,
  withDashboard,
  withAccountsActions,
  withSettings,
)(GeneralLedger);