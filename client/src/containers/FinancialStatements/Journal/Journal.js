import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { compose } from 'utils';
import JournalTable from './JournalTable';

import JournalHeader from './JournalHeader';
import JournalActionsBar from './JournalActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import SettingsConnect from 'connectors/Settings.connect';

import withDashboard from 'containers/Dashboard/withDashboard';
import withJournalActions from './withJournalActions';


function Journal({
  // #withJournalActions
  requestFetchJournalSheet,

  // #withDashboard
  changePageTitle,  

  // #withPreferences
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural'
  });
  const { formatMessage } = useIntl();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    changePageTitle(formatMessage({id:'journal_sheet'}));
  }, []);

  const fetchHook = useQuery(['journal', filter],
    (key, query) => requestFetchJournalSheet(query),
    { manual: true });

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
    setRefetch(true);
  }, [fetchHook]);

  const handlePrintClick = useCallback(() => {

  }, []);

  const handleExportClick = useCallback(() => {

  }, []);

  const handleFetchData = useCallback(({ sortBy, pageIndex, pageSize }) => {
    setRefetch(true);
  }, []);

  useEffect(() => {
    if (refetch) {
      fetchHook.refetch({ force: true });
      setRefetch(false);
    }
  }, [refetch, fetchHook])

  return (
    <DashboardInsider>
      <JournalActionsBar
        onSubmitFilter={handleFilterSubmit}
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
  SettingsConnect,
)(Journal);