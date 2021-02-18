import React, { useMemo } from 'react';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { AppToaster } from 'components';
import {
  CreateExchangeRateFormSchema,
  EditExchangeRateFormSchema,
} from './ExchangeRateForm.schema';
import ExchangeRateFormContent from './ExchangeRateFormContent';
import { useExchangeRateFromContext } from './ExchangeRateFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose, transformToForm } from 'utils';

const defaultInitialValues = {
  exchange_rate: '',
  currency_code: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
};

/**
 * Exchange rate form.
 */
function ExchangeRateForm({
  // #withDialogActions
  closeDialog,
}) {
  const { formatMessage } = useIntl();
  const {
    createExchangeRateMutate,
    editExchangeRateMutate,
    isNewMode,
    dialogName,
    exchangeRate,
  } = useExchangeRateFromContext();

  // Form validation schema in create and edit mode.
  const validationSchema = isNewMode
    ? CreateExchangeRateFormSchema
    : EditExchangeRateFormSchema;
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...transformToForm(exchangeRate, defaultInitialValues),
    }),
    [],
  );

  // Transformers response errors.
  const transformErrors = (errors, { setErrors }) => {
    if (
      errors.find((error) => error.type === 'EXCHANGE.RATE.DATE.PERIOD.DEFINED')
    ) {
      setErrors({
        exchange_rate: formatMessage({
          id: 'there_is_exchange_rate_in_this_date_with_the_same_currency',
        }),
      });
    }
  };

  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: formatMessage({
          id: !isNewMode
            ? 'the_exchange_rate_has_been_edited_successfully'
            : 'the_exchange_rate_has_been_created_successfully',
        }),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };
    // Handle the response error.
    const onError = (error) => {
      const {
        response: {
          data: { errors },
        },
      } = error;

      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    if (isNewMode) {
      createExchangeRateMutate(values).then(onSuccess).catch(onError);
    } else {
      editExchangeRateMutate([exchangeRate.id, values])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <ExchangeRateFormContent />
    </Formik>
  );
}

export default compose(withDialogActions)(ExchangeRateForm);
