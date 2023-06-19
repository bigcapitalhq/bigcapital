// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { sumBy, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { CLASSES } from '@/constants/classes';

import {
  CreateEstimateFormSchema,
  EditEstimateFormSchema,
} from './EstimateForm.schema';

import EstimateFormHeader from './EstimateFormHeader';
import EstimateItemsEntriesField from './EstimateItemsEntriesField';
import EstimateFloatingActions from './EstimateFloatingActions';
import EstimateFormFooter from './EstimateFormFooter';
import EstimateFormDialogs from './EstimateFormDialogs';
import EstimateFormTopBar from './EstimateFormTopBar';
import { EstimateIncrementSyncSettingsToForm } from './components';

import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { AppToaster } from '@/components';
import { compose, transactionNumber, orderingLinesIndexes } from '@/utils';
import { useEstimateFormContext } from './EstimateFormProvider';
import {
  transformToEditForm,
  defaultEstimate,
  transfromsFormValuesToRequest,
  handleErrors,
  resetFormState,
} from './utils';

/**
 * Estimate form.
 */
function EstimateForm({
  // #withSettings
  estimateNextNumber,
  estimateNumberPrefix,
  estimateAutoIncrementMode,

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
        ? { ...transformToEditForm(estimate) }
        : {
            ...defaultEstimate,
            // If the auto-increment mode is enabled, take the next estimate
            // number from the settings.
            ...(estimateAutoIncrementMode && {
              estimate_number: estimateNumber,
            }),
            entries: orderingLinesIndexes(defaultEstimate.entries),
            currency_code: base_currency,
          }),
    }),
    [estimate, estimateNumber, estimateAutoIncrementMode, base_currency],
  );

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
      ...transfromsFormValuesToRequest(values),
      delivered: submitPayload.deliver,
    };
    // Handle the request success.
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
        resetFormState({ resetForm, initialValues, values });
      }
    };
    // Handle the request error.
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
          <EstimateFormTopBar />
          <EstimateFormHeader />
          <EstimateItemsEntriesField />
          <EstimateFormFooter />
          <EstimateFloatingActions />

          {/*------- Dialogs -------*/}
          <EstimateFormDialogs />

          {/*------- Effects -------*/}
          <EstimateIncrementSyncSettingsToForm />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateAutoIncrementMode: estimatesSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(EstimateForm);
