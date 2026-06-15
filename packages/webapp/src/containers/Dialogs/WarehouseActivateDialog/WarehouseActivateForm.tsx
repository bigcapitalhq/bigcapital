// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { useWarehouseActivateContext } from './WarehouseActivateFormProvider';
import { WarehouseActivateFormContent } from './WarehouseActivateFormContent';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

/**
 * warehouse activate form.
 */
function WarehouseActivateFormInner({
  // #withDialogActions
  closeDialog,
}) {
  const { activateWarehouses, dialogName } = useWarehouseActivateContext();

  // Initial form values
  const initialValues = {};

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...values,
    };
    setSubmitting(true);
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('warehouse_activate.dialog_success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
      }
      setSubmitting(false);
    };
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
export const WarehouseActivateForm = flow(withDialogActions)(
  WarehouseActivateFormInner,
);
