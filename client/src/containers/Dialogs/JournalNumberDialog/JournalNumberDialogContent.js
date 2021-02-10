import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
// import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { compose, optionsMapToArray } from 'utils';

import 'style/pages/ManualJournal/JournalNumberDialog.scss'

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

}) {  
  const fetchSettings = useQuery(
    ['settings'],
    () => requestFetchOptions({}),
  );

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key, ...option, group: 'manual_journals',
    }));

    requestSubmitOptions({ options }).then(() => {
      setSubmitting(false);
      closeDialog('journal-number-form');

      setTimeout(() => {
        queryCache.invalidateQueries('settings');
        // setJournalNumberChanged(true);
      }, 250);
    }).catch(() => {
      setSubmitting(false);
    });
  };

  const handleClose = useCallback(() => {
    closeDialog('journal-number-form');
  }, [closeDialog]);

  return (
    <DialogContent isLoading={fetchSettings.isFetching}>
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ manualJournalsSettings }) => ({
    nextNumber: manualJournalsSettings?.nextNumber,
    numberPrefix: manualJournalsSettings?.numberPrefix,
  })),
  // withManualJournalsActions,
)(JournalNumberDialogContent);