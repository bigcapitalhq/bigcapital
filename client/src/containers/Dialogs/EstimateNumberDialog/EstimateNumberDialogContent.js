import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useSaveSettings, useSettingsEstimates } from 'hooks/query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, optionsMapToArray, saveInvoke } from 'utils';

/**
 * Estimate number dialog's content.
 */

function EstimateNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm,
}) {
  const { isLoading: isSettingsLoading } = useSettingsEstimates();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key,
      ...option,
      group: 'sales_estimates',
    }));
    saveSettingsMutate({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('estimate-number-form');
        saveInvoke(onConfirm, values);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('estimate-number-form');
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
  withSettings(({ estimatesSettings }) => ({
    nextNumber: estimatesSettings?.nextNumber,
    numberPrefix: estimatesSettings?.numberPrefix,
  })),
)(EstimateNumberDialogContent);
