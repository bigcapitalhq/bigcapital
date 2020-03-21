import React, {useState, useEffect, useMemo} from 'react';
import {compose} from 'utils';
import LoadingIndicator from 'components/LoadingIndicator';
import JournalConnect from 'connectors/Journal.connect';
import JournalHeader from 'containers/Dashboard/FinancialStatements/Journal/JournalHeader';
import useAsync from 'hooks/async';
import {useIntl} from 'react-intl';
import moment from 'moment';
import JournalTable from './JournalTable';
import DashboardConnect from 'connectors/Dashboard.connector';

function Journal({
  fetchJournalSheet,
  getJournalSheet,
  getJournalSheetIndex,
  changePageTitle,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
  });
  const [reload, setReload] = useState(false);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchJournalSheet(filter),
    ]);
    setReload(false);
  });

  useEffect(() => {
    changePageTitle('Journal');
  }, []);

  useEffect(() => {
    if (reload) {
      fetchHook.execute();
    }
  }, [reload, fetchHook]);

  const journalSheetIndex = useMemo(() => {
    return getJournalSheetIndex(filter);
  }, [filter, getJournalSheetIndex]);

  const handleFilterSubmit = (filter) => {
    setFilter({
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    });
    setReload(true);
  };
  return (
    <div class="financial-statement">
      <JournalHeader
        pageFilter={filter}
        onSubmitFilter={handleFilterSubmit} />

      <div class="financial-statement__body">
        <LoadingIndicator loading={fetchHook.pending}>
          <JournalTable
            journalIndex={journalSheetIndex} />
        </LoadingIndicator>
      </div>
    </div>
  )
}

export default compose(
  JournalConnect,
  DashboardConnect,
)(Journal);