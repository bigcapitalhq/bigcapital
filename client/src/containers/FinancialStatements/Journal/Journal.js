import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import {compose} from 'utils';

import moment from 'moment';
import JournalTable from './JournalTable';

import JournalHeader from './JournalHeader';
import JournalActionsBar from './JournalActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import SettingsConnect from 'connectors/Settings.connect';

import withDashboard from 'containers/Dashboard/withDashboard';
import withJournal from './withJournal';
import withJournalActions from './withJournalActions';


function Journal({
  // #withJournalActions
  requestFetchJournalSheet,

  // #withDashboard
  changePageTitle,  

  // #withJournal
  journalSheetLoading,

  // #withPreferences
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural'
  });

  useEffect(() => {
    changePageTitle('Journal Sheet');
  }, []);

  const fetchHook = useQuery(['journal', filter],
    (key, query) => { requestFetchJournalSheet(query); });

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  }, [fetchHook]);

  const handlePrintClick = useCallback(() => {

  }, []);

  const handleExportClick = useCallback(() => {

  }, []);

  const handleFetchData = useCallback(({ sortBy, pageIndex, pageSize }) => {
    fetchHook.refetch();
  }, [fetchHook]);

  return (
    <DashboardInsider>
      <JournalActionsBar
        onFilterChanged={() => {}}
        onPrintClick={handlePrintClick}
        onExportClick={handleExportClick} />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--journal">
          <JournalHeader 
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />
          
          <div class="financial-statement__table">
            <JournalTable
              companyName={organizationSettings.name}
              journalQuery={filter}
              loading={journalSheetLoading}
              onFetchData={handleFetchData} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  withDashboard,
  withJournalActions,
  withJournal(({ journalSheetLoading }) => ({
    journalSheetLoading,
  })),
  SettingsConnect,
)(Journal);