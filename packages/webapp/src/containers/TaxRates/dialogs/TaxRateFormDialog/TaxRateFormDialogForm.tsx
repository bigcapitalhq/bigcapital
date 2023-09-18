// @ts-nocheck
import React from 'react';
import { Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { AppToaster } from '@/components';

import TaxRateFormDialogFormContent from './TaxRateFormDialogFormContent';

import {
  CreateTaxRateFormSchema,
  EditTaxRateFormSchema,
} from './TaxRateForm.schema';
import {
  isTaxRateChange,
  transformApiErrors,
  transformFormToReq,
  transformTaxRateToForm,
} from './utils';
import { useCreateTaxRate, useEditTaxRate } from '@/hooks/query/taxRates';
import { useTaxRateFormDialogContext } from './TaxRateFormDialogBoot';
import { TaxRateFormDialogFormFooter } from './TaxRateFormDialogFormFooter';
import { TaxRateFormDialogFormErrors } from './TaxRateFormDialogFormErrors';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DRAWERS } from '@/constants/drawers';
import { compose } from '@/utils';

/**
 * Tax rate form dialog content.
 */
function TaxRateFormDialogForm({
  // #withDialogActions
  closeDialog,

  // #withDrawerActions
  closeDrawer,
}) {
  // Account form context.
  const { taxRate, taxRateId, isNewMode, dialogName } =
    useTaxRateFormDialogContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateTaxRateFormSchema
    : EditTaxRateFormSchema;

  const { mutateAsync: createTaxRateMutate } = useCreateTaxRate();
  const { mutateAsync: editTaxRateMutate } = useEditTaxRate();

  // Form initial values in create and edit mode.
  const initialValues = transformTaxRateToForm(taxRate);

  // Callbacks handles form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const isTaxChanged = isTaxRateChange(initialValues, values);

    // Detarmines whether in edit mode and tax rate has been changed
    // and confirm box is not checked.
    if (!isNewMode && isTaxChanged && !values.confirm_edit) {
      setErrors({
        confirm_edit:
          'Please review the terms and conditions below before proceeding',
      });
      setSubmitting(false);
      return;
    }
    const form = transformFormToReq(values);

    // Handle request success on edit.
    const handleSuccessOnEdit = (response) => {
      if (response?.data?.data?.id !== taxRateId) {
        closeDrawer(DRAWERS.TAX_RATE_DETAILS);
      }
    };
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
    if (isNewMode) {
      createTaxRateMutate({ ...form })
        .then(handleSuccess)
        .catch(handleError);
    } else {
      editTaxRateMutate([taxRateId, { ...form }])
        .then(handleSuccessOnEdit)
        .then(handleSuccess)
        .catch(handleError);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <div className={Classes.DIALOG_BODY}>
          <TaxRateFormDialogFormErrors />
          <TaxRateFormDialogFormContent />
        </div>
        <TaxRateFormDialogFormFooter />
      </Form>
    </Formik>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
)(TaxRateFormDialogForm);
