// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { TransactionNumberDialogProvider } from './TransactionNumberDialogProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingCashFlow } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Transaction number dialog content.
 */
function TransactionNumberDialogContentInner({
  // #ownProps
  initialValues,
  onConfirm,

  // #withDialogActions
  closeDialog,
}) {
  const { data: cashflowSettings } = useSettingCashFlow();
  const nextNumber = cashflowSettings?.nextNumber as number | undefined;
  const numberPrefix = cashflowSettings?.numberPrefix as
    | string
    | undefined;
  const autoIncrement = cashflowSettings?.autoIncrement as
    | boolean
    | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('transaction-number-form');
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
    const options = transformFormToSettings(values, 'cashflow');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('cash_flow.auto_increment.auto')
      : intl.get('cash_flow.auto_increment.manually');

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('transaction-number-form');
  };

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  return (
    <TransactionNumberDialogProvider>
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
    </TransactionNumberDialogProvider>
  );
}

export const TransactionNumberDialogContent = compose(
  withDialogActions,
)(TransactionNumberDialogContentInner);
