import { FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { DialogContent } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingsManualJournals } from '@/hooks/query';
import { saveInvoke, compose } from '@/utils';

import '@/style/pages/ManualJournal/JournalNumberDialog.scss';

interface JournalNumberDialogContentProps extends WithDialogActionsProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Journal number dialog's content.
 */
function JournalNumberDialogContentInner({
  closeDialog,
  onConfirm,
  initialValues,
}: JournalNumberDialogContentProps): React.ReactElement {
  const { data: manualJournalsSettings, isLoading: isSettingsLoading } =
    useSettingsManualJournals();
  const nextNumber = manualJournalsSettings?.nextNumber as
    | string
    | number
    | undefined;
  const numberPrefix = manualJournalsSettings?.numberPrefix as
    | string
    | undefined;
  const autoIncrement = manualJournalsSettings?.autoIncrement as
    | boolean
    | string
    | undefined;
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] =
    React.useState<Partial<ReferenceNumberFormValues> | null>(null);

  // Handle the form submit.
  const handleSubmitForm = (
    values: ReferenceNumberFormValues,
    { setSubmitting }: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
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
    // Transformes the form values to settings to save it.
    const options = transformFormToSettings(values, 'manual_journals');

    saveSettingsMutate({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = useCallback(() => {
    closeDialog('journal-number-form');
  }, [closeDialog]);

  // Handle form change.
  const handleChange = (values: ReferenceNumberFormValues) => {
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

export const JournalNumberDialogContent = compose(withDialogActions)(
  JournalNumberDialogContentInner,
);
