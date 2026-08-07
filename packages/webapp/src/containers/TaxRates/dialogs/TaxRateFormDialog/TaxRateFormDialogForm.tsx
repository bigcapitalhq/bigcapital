import { Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import {
  CreateTaxRateFormSchema,
  EditTaxRateFormSchema,
} from './TaxRateForm.schema';
import { useTaxRateFormDialogContext } from './TaxRateFormDialogBoot';
import { TaxRateFormDialogContent as TaxRateFormDialogFormContent } from './TaxRateFormDialogFormContent';
import { TaxRateFormDialogFormErrors } from './TaxRateFormDialogFormErrors';
import { TaxRateFormDialogFormFooter } from './TaxRateFormDialogFormFooter';
import {
  isTaxRateChange,
  transformApiErrors,
  transformFormToReq,
  transformTaxRateToForm,
  TaxRateFormValues,
} from './utils';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { useCreateTaxRate, useEditTaxRate } from '@/hooks/query/tax-rates';
import { compose } from '@/utils';

interface TaxRateFormDialogFormProps
  extends Pick<WithDialogActionsProps, 'closeDialog'>,
    Pick<WithDrawerActionsProps, 'closeDrawer'> {}

/**
 * Tax rate form dialog content.
 */
function TaxRateFormDialogFormInner({
  closeDialog,
  closeDrawer,
}: TaxRateFormDialogFormProps) {
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
  const handleFormSubmit = (
    values: TaxRateFormValues,
    { setSubmitting, setErrors }: FormikHelpers<TaxRateFormValues>,
  ) => {
    const isTaxChanged = isTaxRateChange(initialValues, values);

    // Detarmines whether in edit mode and tax rate has been changed
    // and confirm box is not checked.
    if (!isNewMode && isTaxChanged && !values.confirmEdit) {
      setErrors({
        confirmEdit:
          'Please review the terms and conditions below before proceeding',
      });
      setSubmitting(false);
      return;
    }
    const form = transformFormToReq(values);

    // Handle request success on edit.
    const handleSuccessOnEdit = () => {
      closeDrawer(DRAWERS.TAX_RATE_DETAILS);
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
    const handleError = (error: ApiError) => {
      const errors =
        (error.data?.errors as Array<{ type?: string }> | undefined) ?? [];

      const errorsTransformed = transformApiErrors(errors);
      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    if (isNewMode) {
      createTaxRateMutate(form).then(handleSuccess).catch(handleError);
    } else {
      editTaxRateMutate([String(taxRateId), form])
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

export const TaxRateFormDialogForm = compose(
  withDialogActions,
  withDrawerActions,
)(TaxRateFormDialogFormInner);
