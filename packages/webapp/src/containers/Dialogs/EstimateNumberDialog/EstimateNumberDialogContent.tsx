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
import { useSaveSettings, useSettingsEstimates } from '@/hooks/query';
import { compose, saveInvoke } from '@/utils';

interface EstimateNumberDialogContentProps extends WithDialogActionsProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Estimate number dialog's content.
 */
function EstimateNumberDialogContentInner({
  closeDialog,
  initialValues,
  onConfirm,
}: EstimateNumberDialogContentProps): React.ReactElement {
  const [referenceFormValues, setReferenceFormValues] =
    React.useState<Partial<ReferenceNumberFormValues> | null>(null);

  // Fetches the estimates settings.
  const { data: estimatesSettings, isLoading: isSettingsLoading } =
    useSettingsEstimates();
  const nextNumber = estimatesSettings?.nextNumber as
    | string
    | number
    | undefined;
  const numberPrefix = estimatesSettings?.numberPrefix as string | undefined;
  const autoIncrement = estimatesSettings?.autoIncrement as
    | boolean
    | string
    | undefined;

  // Mutates the settings.
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  // Handle the submit form.
  const handleSubmitForm = (
    values: ReferenceNumberFormValues,
    { setSubmitting }: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
    // Transformes the form values to settings to save it.
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
  const handleChange = (values: ReferenceNumberFormValues) => {
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

export const EstimateNumberDialogContent = compose(withDialogActions)(
  EstimateNumberDialogContentInner,
);
