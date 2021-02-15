import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import {
  CreateEstimateFormSchema,
  EditEstimateFormSchema,
} from './EstimateForm.schema';

import EstimateFormHeader from './EstimateFormHeader';
import EstimateFormBody from './EstimateFormBody';
import EstimateFloatingActions from './EstimateFloatingActions';
import EstimateFormFooter from './EstimateFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import { ERROR } from 'common/errors';
import {
  compose,
  repeatValue,
  orderingLinesIndexes,
} from 'utils';
import { useEstimateFormContext } from './EstimateFormProvider';

const MIN_LINES_NUMBER = 4;

const defaultEstimate = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: 1,
  description: '',
};

const defaultInitialValues = {
  customer_id: '',
  estimate_date: moment(new Date()).format('YYYY-MM-DD'),
  expiration_date: moment(new Date()).format('YYYY-MM-DD'),
  estimate_number: '',
  delivered: '',
  reference: '',
  note: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultEstimate, MIN_LINES_NUMBER)],
};

/**
 * Estimate form.
 */
const EstimateForm = ({
  // #withSettings
  estimateNextNumber,
  estimateNumberPrefix,
}) => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const {
    estimate,
    isNewMode,
    submitPayload,
    createEstimateMutate,
    editEstimateMutate,
  } = useEstimateFormContext();

  const estimateNumber = estimateNumberPrefix
    ? `${estimateNumberPrefix}-${estimateNextNumber}`
    : estimateNextNumber;

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(estimate
        ? {
            ...pick(estimate, Object.keys(defaultInitialValues)),
            entries: [
              ...estimate.entries.map((estimate) => ({
                ...pick(estimate, Object.keys(defaultEstimate)),
              })),
              ...repeatValue(
                defaultEstimate,
                Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            estimate_number: estimateNumber,
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [estimate, estimateNumber],
  );

  // Transform response errors to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.ESTIMATE_NUMBER_IS_NOT_UNQIUE)) {
      setErrors({
        estimate_number: formatMessage({
          id: 'estimate_number_is_not_unqiue',
        }),
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

    if (totalQuantity === 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'quantity_cannot_be_zero_or_empty',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...values,
      delivered: submitPayload.deliver,
      // Exclude all entries properties that out of request schema.
      entries: entries.map((entry) => ({
        ...pick(entry, Object.keys(defaultEstimate)),
      })),
    };
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_estimate_has_been_edited_successfully'
              : 'the_estimate_has_been_created_successfully',
          },
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

    const onError = (errors) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    if (estimate && estimate.id) {
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
          <EstimateFormBody defaultEstimate={defaultEstimate} />
          <EstimateFormFooter />
          <EstimateFloatingActions />
        </Form>
      </Formik>
    </div>
  );
};

export default compose(
  withDashboardActions,
  withMediaActions,
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
  })),
)(EstimateForm);
