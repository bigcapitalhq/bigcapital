import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { WarehouseActivateFormContent } from './WarehouseActivateFormContent';
import { useWarehouseActivateContext } from './WarehouseActivateFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface WarehouseActivateFormProps extends WithDialogActionsProps {}

function WarehouseActivateFormInner({
  closeDialog,
}: WarehouseActivateFormProps): React.ReactElement {
  const { activateWarehouses, dialogName } = useWarehouseActivateContext();

  const initialValues: Record<string, never> = {};

  const handleFormSubmit = (
    values: Record<string, never>,
    { setSubmitting }: FormikHelpers<Record<string, never>>,
  ) => {
    const form = { ...values };
    setSubmitting(true);
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('warehouse_activate.dialog_success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    const onError = () => {
      setSubmitting(false);
    };
    // @ts-expect-error — latent bug preserved: hook expects a number id, original code passed an object.
    activateWarehouses(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={WarehouseActivateFormContent}
    />
  );
}
export const WarehouseActivateForm = compose(withDialogActions)(
  WarehouseActivateFormInner,
);
