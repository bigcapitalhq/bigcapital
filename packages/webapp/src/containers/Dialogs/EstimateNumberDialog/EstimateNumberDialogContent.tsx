// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';

import { DialogContent } from '@/components';
import { useSaveSettings, useSettingsEstimates } from '@/hooks/query';

import ReferenceNumberForm from '@/containers/JournalNumber/ReferenceNumberForm';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

import { compose, saveInvoke } from '@/utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';

/**
 * Estimate number dialog's content.
 */
function EstimateNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,

  // #ownProps
  initialValues,
  onConfirm,
}) {
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Fetches the estimates settings.
  const { isLoading: isSettingsLoading } = useSettingsEstimates();

  // Mutates the settings.
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Transforms the form values to settings to save it.
    const options = transformFormToSettings(values, 'sales_estimates');

    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('estimate-number-form');
      saveInvoke(onConfirm, values);
    };
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    saveSettingsMutate({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = useCallback(() => {
    closeDialog('estimate-number-form');
  }, [closeDialog]);

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('estimate.auto_increment.auto')
      : intl.get('estimate.auto_increment.manually');

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
        onClose={handleClose}
        onChange={handleChange}
        description={description}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ estimatesSettings }) => ({
    nextNumber: estimatesSettings?.nextNumber,
    numberPrefix: estimatesSettings?.numberPrefix,
    autoIncrement: estimatesSettings?.autoIncrement,
  })),
)(EstimateNumberDialogContent);
