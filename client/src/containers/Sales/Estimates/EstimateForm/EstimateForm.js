import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { omit, sumBy, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import {
  CreateEstimateFormSchema,
  EditEstimateFormSchema,
} from './EstimateForm.schema';

import EstimateFormHeader from './EstimateFormHeader';
import EstimateItemsEntriesField from './EstimateItemsEntriesField';
import EstimateFloatingActions from './EstimateFloatingActions';
import EstimateFormFooter from './EstimateFormFooter';
import EstimateFormDialogs from './EstimateFormDialogs';

import withSettings from 'containers/Settings/withSettings';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { AppToaster } from 'components';
import { ERROR } from 'common/errors';
import { compose, transactionNumber, orderingLinesIndexes } from 'utils';
import { useEstimateFormContext } from './EstimateFormProvider';
import { transformToEditForm, defaultEstimate } from './utils';

/**
 * Estimate form.
 */
function EstimateForm({
  // #withSettings
  estimateNextNumber,
  estimateNumberPrefix,
  estimateIncrementMode,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();
  const {
    estimate,
    isNewMode,
    submitPayload,
    createEstimateMutate,
    editEstimateMutate,
  } = useEstimateFormContext();

  const estimateNumber = transactionNumber(
    estimateNumberPrefix,
    estimateNextNumber,
  );

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(estimate)
        ? { ...transformToEditForm(estimate), currency_code: base_currency }
        : {
            ...defaultEstimate,
            ...(estimateIncrementMode && {
              estimate_number: estimateNumber,
            }),
            entries: orderingLinesIndexes(defaultEstimate.entries),
            currency_code: base_currency,
          }),
    }),
    [estimate, estimateNumber, estimateIncrementMode],
  );

  // Transform response errors to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.ESTIMATE_NUMBER_IS_NOT_UNQIUE)) {
      setErrors({
        estimate_number: intl.get('estimate_number_is_not_unqiue'),
      });
    }
    if (
      errors.some((error) => error.type === ERROR.SALE_ESTIMATE_NO_IS_REQUIRED)
    ) {
      setErrors({
        estimate_number: intl.get('estimate.field.error.estimate_number'),
      });
    }
  };

  // Handles form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    setSubmitting(true);

    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

    // Validate the entries quantity should be bigger than zero.
    if (totalQuantity === 0) {
      AppToaster.show({
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...omit(values, ['estimate_number_manually', 'estimate_number']),
      ...(values.estimate_number_manually && {
        estimate_number: values.estimate_number,
      }),
      delivered: submitPayload.deliver,
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_estimate_has_been_created_successfully'
            : 'the_estimate_has_been_edited_successfully',
          { number: values.estimate_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/estimates');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };

    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isNewMode) {
      editEstimateMutate([estimate.id, form]).then(onSuccess).catch(onError);
    } else {
      createEstimateMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_ESTIMATE,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateEstimateFormSchema : EditEstimateFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <EstimateFormHeader />
          <EstimateItemsEntriesField />
          <EstimateFormFooter />
          <EstimateFloatingActions />

          <EstimateFormDialogs />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateIncrementMode: estimatesSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(EstimateForm);
