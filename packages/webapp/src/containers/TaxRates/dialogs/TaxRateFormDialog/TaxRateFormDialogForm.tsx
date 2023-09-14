// @ts-nocheck
import React, { useCallback } from 'react';
import { Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { AppToaster } from '@/components';

import TaxRateFormDialogFormContent from './TaxRateFormDialogFormContent';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  CreateTaxRateFormSchema,
  EditTaxRateFormSchema,
} from './TaxRateForm.schema';
import { transformApiErrors, transformFormToReq } from './utils';
import { useCreateTaxRate, useEditTaxRate } from '@/hooks/query/taxRates';
import { useTaxRateFormDialogContext } from './TaxRateFormDialogBoot';
import { TaxRateFormDialogFormFooter } from './TaxRateFormDialogFormFooter';
import { compose, transformToForm } from '@/utils';

// Default initial form values.
const defaultInitialValues = {
  name: '',
  code: '',
  rate: '',
  description: '',
  is_compound: false,
  is_non_recoverable: false,
};

/**
 * Tax rate form dialog content.
 */
function TaxRateFormDialogForm({
  // #withDialogActions
  closeDialog,
}) {
  // Account form context.
  const {
    account,

    payload,
    isNewMode,
    dialogName,
  } = useTaxRateFormDialogContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateTaxRateFormSchema
    : EditTaxRateFormSchema;

  const { mutateAsync: createTaxRateMutate } = useCreateTaxRate();
  const { mutateAsync: editTaxRateMutate } = useEditTaxRate();

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = transformFormToReq(values);

    // Handle request success.
    const handleSuccess = () => {
      closeDialog(dialogName);

      AppToaster.show({
        message: 'The tax rate has been created successfully.',
        intent: Intent.SUCCESS,
      });
    };
    // Handle request error.
    const handleError = (error) => {
      const {
        response: {
          data: { errors },
        },
      } = error;

      const errorsTransformed = transformApiErrors(errors);
      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    if (payload.accountId) {
      editTaxRateMutate([payload.accountId, form])
        .then(handleSuccess)
        .catch(handleError);
    } else {
      createTaxRateMutate({ ...form })
        .then(handleSuccess)
        .catch(handleError);
    }
  };
  // Form initial values in create and edit mode.
  const initialValues = {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToForm(account, defaultInitialValues),
  };
  // Handles dialog close.
  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <div className={Classes.DIALOG_BODY}>
          <TaxRateFormDialogFormContent
            dialogName={dialogName}
            action={payload?.action}
            onClose={handleClose}
          />
        </div>
        <TaxRateFormDialogFormFooter />
      </Form>
    </Formik>
  );
}

export default compose(withDialogActions)(TaxRateFormDialogForm);
