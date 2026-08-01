import { FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { VendorCreditNumberDilaogProvider } from './VendorCreditNumberDilaogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingsVendorCredits } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorCreditNumberDialogContentProps extends WithDialogActionsProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Vendor credit number dialog
 */
function VendorCreditNumberDialogContentInner({
  initialValues,
  onConfirm,
  closeDialog,
}: VendorCreditNumberDialogContentProps): React.ReactElement {
  const { data: vendorCreditSettings } = useSettingsVendorCredits();
  const nextNumber = vendorCreditSettings?.nextNumber as
    | string
    | number
    | undefined;
  const numberPrefix = vendorCreditSettings?.numberPrefix as string | undefined;
  const autoIncrement = vendorCreditSettings?.autoIncrement as
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
      closeDialog('vendor-credit-form');
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
    const options = transformFormToSettings(values, 'vendor_credit');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('vendor-credit-form');
  };
  // Handle form change.
  const handleChange = (values: ReferenceNumberFormValues) => {
    setReferenceFormValues(values);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('vendor_credit.auto_increment.auto')
      : intl.get('vendor_credit.auto_increment.manually');

  return (
    <VendorCreditNumberDilaogProvider>
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
    </VendorCreditNumberDilaogProvider>
  );
}

export const VendorCreditNumberDialogContent = compose(withDialogActions)(
  VendorCreditNumberDialogContentInner,
);
