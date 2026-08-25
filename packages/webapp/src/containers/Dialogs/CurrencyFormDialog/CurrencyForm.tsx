import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import {
  CreateCurrencyFormSchema,
  EditCurrencyFormSchema,
} from './CurrencyForm.schema';
import { CurrencyFormContent } from './CurrencyFormContent';
import { useCurrencyFormContext } from './CurrencyFormProvider';
import type { CurrencyFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: CurrencyFormValues = {
  currencyName: '',
  currencyCode: '',
  currencySign: '',
};

interface CurrencyFormProps extends WithDialogActionsProps {}

/**
 * Currency form.
 */
function CurrencyFormInner({
  closeDialog,
}: CurrencyFormProps): React.ReactElement {
  const {
    createCurrencyMutate,
    editCurrencyMutate,
    dialogName,
    currency,
    isEditMode,
  } = useCurrencyFormContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isEditMode
    ? EditCurrencyFormSchema
    : CreateCurrencyFormSchema;

  // FIXME: deps array is empty — initial values won't refresh when the async
  // `currency` resolves. Preserved from the @ts-nocheck original.
  const initialValues = useMemo<CurrencyFormValues>(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(currency, defaultInitialValues),
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (
    values: CurrencyFormValues,
    { setSubmitting }: FormikHelpers<CurrencyFormValues>,
  ) => {
    setSubmitting(true);

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isEditMode
            ? 'the_currency_has_been_edited_successfully'
            : 'the_currency_has_been_created_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      afterSubmit();
    };
    // Handle the response error.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors.find((e) => e.type === 'CURRENCY_CODE_EXISTS')) {
        // FIXME: hardcoded English string — should use intl.
        AppToaster.show({
          message: 'The given currency code is already exists.',
          intent: Intent.DANGER,
        });
      }
      setSubmitting(false);
    };
    if (isEditMode) {
      // FIXME: `currency` is a code string from the dialog payload (not an
      // object with `.id`); edit-mode currency update is broken at runtime.
      // @ts-expect-error — latent bug preserved: `currency.id` undefined access.
      editCurrencyMutate([currency.id, values]).then(onSuccess).catch(onError);
    } else {
      createCurrencyMutate(values).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <CurrencyFormContent />
    </Formik>
  );
}

export const CurrencyForm = compose(withDialogActions)(CurrencyFormInner);
