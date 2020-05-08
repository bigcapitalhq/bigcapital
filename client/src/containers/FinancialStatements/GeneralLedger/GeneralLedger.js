import React, { useEffect, useCallback, useState, useMemo } from 'react';
import moment from 'moment';
import GeneralLedgerTable from 'containers/FinancialStatements/GeneralLedger/GeneralLedgerTable';
import useAsync from 'hooks/async';
import DashboardConnect from 'connectors/Dashboard.connector';
import GeneralLedgerConnect from 'connectors/GeneralLedgerSheet.connect';
import GeneralLedgerHeader from './GeneralLedgerHeader';
import {compose} from 'utils';
import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import GeneralLedgerActionsBar from './GeneralLedgerActionsBar';
import AccountsConnect from 'connectors/Accounts.connector';
import SettingsConnect from 'connectors/Settings.connect';

function GeneralLedger({
  changePageTitle,
  getGeneralLedgerSheetIndex,
  getGeneralLedgerSheet,
  fetchGeneralLedger,
  generalLedgerSheetLoading,
  requestFetchAccounts,
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    none_zero: true,
  });

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('General Ledger');
  }, []);

  const fetchHook = useAsync(() => {
    return Promise.all([
      requestFetchAccounts(),
    ]);
  });

  const fetchSheet = useAsync((query = filter) => {
    return Promise.all([
      fetchGeneralLedger(query),
    ]);
  }, false);

  const generalLedgerSheetIndex = useMemo(() => 
    getGeneralLedgerSheetIndex(filter),
    [getGeneralLedgerSheetIndex, filter]);

  const generalLedgerSheet = useMemo(() =>
    getGeneralLedgerSheet(generalLedgerSheetIndex),
    [generalLedgerSheetIndex, getGeneralLedgerSheet])

  // Handle fetch data of trial balance table.
  const handleFetchData = useCallback(() => { fetchSheet.execute() }, [fetchSheet]);
  
  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const parsedFilter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(parsedFilter);
    fetchSheet.execute(parsedFilter);
  }, [setFilter, fetchSheet]);

  const handleFilterChanged = () => {};

  return (
    <DashboardInsider>
      <GeneralLedgerActionsBar onFilterChanged={handleFilterChanged} />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--general-ledger">
          <GeneralLedgerHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__table">
            <GeneralLedgerTable
              companyName={organizationSettings.name}
              loading={generalLedgerSheetLoading}
              data={[
                ... (generalLedgerSheet) ?
                  generalLedgerSheet.tableRows : [],
              ]}
              onFetchData={handleFetchData} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  AccountsConnect,
  GeneralLedgerConnect,
  SettingsConnect,
)(GeneralLedger);