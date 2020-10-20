import React from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * Journal number dialog's content.
 */
function JournalNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,

  // #withManualJournalsActions
  setJournalNumberChanged,
}) {
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'manual_journals' };
    });

    requestSubmitOptions({ options }).then(() => {
      setSubmitting(false);
      closeDialog('journal-number-form');
      setJournalNumberChanged(true);

      setTimeout(() => {
        queryCache.invalidateQueries('settings');
      }, 250);
    }).catch(() => {
      setSubmitting(false);
    });
  };

  const handleClose = () => {
    closeDialog('journal-number-form');
  };

  return (
    <DialogContent isLoading={fetchSettings.isFetching}>
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
      />
    </DialogContent>
  )
}

export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ manualJournalsSettings }) => ({
    nextNumber: manualJournalsSettings?.next_number,
    numberPrefix: manualJournalsSettings?.number_prefix,
  })),
  withManualJournalsActions,
)(JournalNumberDialogContent);