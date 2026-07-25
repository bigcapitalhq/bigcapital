// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { CreditNoteNumberDialogProvider } from './CreditNoteNumberDialogProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingsCreditNotes } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * credit note number dialog content
 */
function CreditNoteNumberDialogContentInner({
  // #ownProps
  initialValues,
  onConfirm,

  // #withDialogActions
  closeDialog,
}) {
  const { data: creditNoteSettings } = useSettingsCreditNotes();
  const nextNumber = creditNoteSettings?.nextNumber as number | undefined;
  const numberPrefix = creditNoteSettings?.numberPrefix as string | undefined;
  const autoIncrement = creditNoteSettings?.autoIncrement as
    | boolean
    | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('credit-number-form');
      onConfirm(values);
    };
    // Handle the form errors.
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    // Transformes the form values to settings to save it.
    const options = transformFormToSettings(values, 'credit_note');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('credit-number-form');
  };
  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };
  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('credit_note.auto_increment.auto')
      : intl.get('credit_note.auto_increment.manually');

  return (
    <CreditNoteNumberDialogProvider>
      <ReferenceNumberForm
        initialValues={{
          ...transformSettingsToForm({
            nextNumber,
            numberPrefix,
            autoIncrement,
          }),
          ...initialValues,
        }}
        description={description}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
        onChange={handleChange}
      />
    </CreditNoteNumberDialogProvider>
  );
}

export const CreditNoteNumberDialogContent = compose(
  withDialogActions,
)(CreditNoteNumberDialogContentInner);
