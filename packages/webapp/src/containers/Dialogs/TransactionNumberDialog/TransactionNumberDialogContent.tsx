import { FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { TransactionNumberDialogProvider } from './TransactionNumberDialogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingCashFlow } from '@/hooks/query';
import { compose } from '@/utils';

interface TransactionNumberDialogContentProps extends WithDialogActionsProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Transaction number dialog content.
 */
function TransactionNumberDialogContentInner({
  initialValues,
  onConfirm,
  closeDialog,
}: TransactionNumberDialogContentProps): React.ReactElement {
  const { data: cashflowSettings } = useSettingCashFlow();
  const nextNumber = cashflowSettings?.nextNumber as
    | string
    | number
    | undefined;
  const numberPrefix = cashflowSettings?.numberPrefix as string | undefined;
  const autoIncrement = cashflowSettings?.autoIncrement as
    | boolean
    | string
    | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] =
    React.useState<Partial<ReferenceNumberFormValues> | null>(null);

  // Handle the submit form.
  const handleSubmitForm = (
    values: ReferenceNumberFormValues,
    { setSubmitting }: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('transaction-number-form');
      onConfirm?.(values);
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
  const handleChange = (values: ReferenceNumberFormValues) => {
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

export const TransactionNumberDialogContent = compose(withDialogActions)(
  TransactionNumberDialogContentInner,
);
