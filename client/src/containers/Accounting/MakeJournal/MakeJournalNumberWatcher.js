import { useEffect } from 'react';
import { compose } from 'redux';
import { useFormikContext } from 'formik';

import withManualJournalsActions from './withManualJournalsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withManualJournals from './withManualJournals';

import { defaultToTransform } from 'utils';

/**
 * Journal number chaلing watcher.
 */
function MakeJournalNumberChangingWatcher({
  // #withDashboardActions
  changePageSubtitle,

  // #withManualJournals
  journalNumberChanged,

  // #withManualJournalsActions
  setJournalNumberChanged,

  // #ownProps
  journalNumber,
}) {
  const { setFieldValue } = useFormikContext();

  // Observes journal number settings changes.
  useEffect(() => {
    if (journalNumberChanged) {
      setFieldValue('journal_number', journalNumber);
      changePageSubtitle(
        defaultToTransform(journalNumber, `No. ${journalNumber}`, ''),
      );
      setJournalNumberChanged(false);
    }
  }, [
    journalNumber,
    journalNumberChanged,
    setJournalNumberChanged,
    setFieldValue,
    changePageSubtitle,
  ]);
  return null;
}

export default compose(
  withManualJournals(({ journalNumberChanged }) => ({
    journalNumberChanged,
  })),
  withManualJournalsActions,
  withDashboardActions,
)(MakeJournalNumberChangingWatcher);