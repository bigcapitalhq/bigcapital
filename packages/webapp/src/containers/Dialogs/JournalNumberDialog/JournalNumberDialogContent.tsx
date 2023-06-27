// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { DialogContent } from '@/components';
import { useSaveSettings, useSettingsManualJournals } from '@/hooks/query';

import ReferenceNumberForm from '@/containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';
import { saveInvoke, compose } from '@/utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';

import '@/style/pages/ManualJournal/JournalNumberDialog.scss';

/**
 * Journal number dialog's content.
 */
function JournalNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm,
  initialValues,
}) {
  const { isLoading: isSettingsLoading } = useSettingsManualJournals();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Handle the form submit.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('journal-number-form');
      saveInvoke(onConfirm, values);
    };
    // Handle errors.
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    // Transforms the form values to settings to save it.
    const options = transformFormToSettings(values, 'manual_journals');

    saveSettingsMutate({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = useCallback(() => {
    closeDialog('journal-number-form');
  }, [closeDialog]);

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('manual_journals.auto_increment.auto')
      : intl.get('manual_journals.auto_increment.manually');

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <ReferenceNumberForm
        initialValues={{
          ...transformSettingsToForm({
            nextNumber,
            numberPrefix,
            autoIncrement,
          }),
          ...initialValues,
        }}
        onSubmit={handleSubmitForm}
        description={description}
        onClose={handleClose}
        onChange={handleChange}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ manualJournalsSettings }) => ({
    nextNumber: manualJournalsSettings?.nextNumber,
    numberPrefix: manualJournalsSettings?.numberPrefix,
    autoIncrement: manualJournalsSettings?.autoIncrement,
  })),
)(JournalNumberDialogContent);
