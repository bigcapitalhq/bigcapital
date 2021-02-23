import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useSaveSettings, useSettingsManualJournals } from 'hooks/query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';
import { saveInvoke, compose, optionsMapToArray } from 'utils';

import 'style/pages/ManualJournal/JournalNumberDialog.scss'

/**
 * Journal number dialog's content.
 */
function JournalNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm
}) {
  const { isLoading: isSettingsLoading } = useSettingsManualJournals();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  // Handle the form submit. 
  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key, ...option, group: 'manual_journals',
    }));

    saveSettingsMutate({ options }).then(() => {
      setSubmitting(false);
      closeDialog('journal-number-form');
      saveInvoke(onConfirm, values);
    }).catch(() => {
      setSubmitting(false);
    });
  };

  const handleClose = useCallback(() => {
    closeDialog('journal-number-form');
  }, [closeDialog]);

  return (
    <DialogContent isLoading={isSettingsLoading}>
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
  withSettings(({ manualJournalsSettings }) => ({
    nextNumber: manualJournalsSettings?.nextNumber,
    numberPrefix: manualJournalsSettings?.numberPrefix,
  })),
)(JournalNumberDialogContent);