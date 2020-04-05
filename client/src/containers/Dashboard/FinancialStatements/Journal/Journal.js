import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {compose} from 'utils';
import JournalConnect from 'connectors/Journal.connect';
import JournalHeader from 'containers/Dashboard/FinancialStatements/Journal/JournalHeader';
import useAsync from 'hooks/async';
import {useIntl} from 'react-intl';
import moment from 'moment';
import JournalTable from './JournalTable';
import DashboardConnect from 'connectors/Dashboard.connector';
import JournalActionsBar from './JournalActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import SettingsConnect from 'connectors/Settings.connect';

function Journal({
  fetchJournalSheet,
  getJournalSheet,
  getJournalSheetIndex,
  changePageTitle,
  journalSheetLoading,
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

  const fetchHook = useAsync((query = filter) => {
    return Promise.all([
      fetchJournalSheet(query),    
    ]);
  }, false);

  // Retrieve journal sheet index by the given filter query.
  const journalSheetIndex = useMemo(() => 
    getJournalSheetIndex(filter),
    [getJournalSheetIndex, filter]);

  // Retrieve journal sheet by the given sheet index.
  const journalSheet = useMemo(() => 
    getJournalSheet(journalSheetIndex),
    [getJournalSheet, journalSheetIndex]);

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
    fetchHook.execute(_filter);
  }, [fetchHook]);

  const handlePrintClick = useCallback(() => {

  }, []);

  const handleExportClick = useCallback(() => {

  }, []);

  const handleFetchData = useCallback(({ sortBy, pageIndex, pageSize }) => {
    fetchHook.execute();
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
              data={[
                ...(journalSheet && journalSheet.tableRows)
                  ? journalSheet.tableRows : []
              ]}
              loading={journalSheetLoading}
              onFetchData={handleFetchData} />              
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  JournalConnect,
  DashboardConnect,
  SettingsConnect,
)(Journal);