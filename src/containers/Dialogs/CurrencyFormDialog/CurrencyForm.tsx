// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { AppToaster } from '@/components';
import CurrencyFormContent from './CurrencyFormContent';

import { useCurrencyFormContext } from './CurrencyFormProvider';
import {
  CreateCurrencyFormSchema,
  EditCurrencyFormSchema,
} from './CurrencyForm.schema';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose, transformToForm } from '@/utils';

const defaultInitialValues = {
  currency_name: '',
  currency_code: '',
  currency_sign: '',
};

/**
 * Currency form.
 */
function CurrencyForm({
  // #withDialogActions
  closeDialog,
}) {
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

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      // ...(isEditMode && pick(currency, Object.keys(defaultInitialValues))),
      ...transformToForm(currency, defaultInitialValues),
    }),
    [],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    // Handle the request success.
    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: intl.get(
          isEditMode
            ? 'the_currency_has_been_edited_successfully'
            : 'the_currency_has_been_created_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };
    // Handle the response error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors.find((e) => e.type === 'CURRENCY_CODE_EXISTS')) {
        AppToaster.show({
          message: 'The given currency code is already exists.',
          intent: Intent.DANGER,
        });
      }
      setSubmitting(false);
    };
    if (isEditMode) {
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

export default compose(withDialogActions)(CurrencyForm);
