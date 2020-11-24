import React, { useMemo, useCallback, useEffect, useState } from 'react';
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
import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';
import EstimateFloatingActions from './EstimateFloatingActions';
import EstimateFormFooter from './EstimateFormFooter';
import EstimateNumberWatcher from './EstimateNumberWatcher';

import withEstimateActions from './withEstimateActions';
import withEstimateDetail from './withEstimateDetail';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';
import { ERROR } from 'common/errors';

import {
  compose,
  repeatValue,
  defaultToTransform,
  orderingLinesIndexes,
} from 'utils';

const MIN_LINES_NUMBER = 4;

const defaultEstimate = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: '',
  description: '',
};

const defaultInitialValues = {
  customer_id: '',
  estimate_date: moment(new Date()).format('YYYY-MM-DD'),
  expiration_date: moment(new Date()).format('YYYY-MM-DD'),
  estimate_number: '',
  reference: '',
  note: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultEstimate, MIN_LINES_NUMBER)],
};

/**
 * Estimate form.
 */
const EstimateForm = ({
  // #WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  // #WithEstimateActions
  requestSubmitEstimate,
  requestEditEstimate,
  setEstimateNumberChanged,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  estimateNextNumber,
  estimateNumberPrefix,

  //#withEstimateDetail
  estimate,

  // #withEstimates
  estimateNumberChanged,

  //#own Props
  estimateId,
  onFormSubmit,
  onCancelForm,
}) => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const [submitPayload, setSubmitPayload] = useState({});

  const isNewMode = !estimateId;

  const estimateNumber = estimateNumberPrefix
    ? `${estimateNumberPrefix}-${estimateNextNumber}`
    : estimateNextNumber;

  useEffect(() => {
    const transNumber = !isNewMode ? estimate.estimate_number  : estimateNumber;

    if (isNewMode) {
      changePageTitle(formatMessage({ id: 'edit_estimate' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_estimate' }));
    }
    changePageSubtitle(
      defaultToTransform(estimateNumber, `No. ${transNumber}`, ''),
    );
  }, [
    estimate,
    estimateNumber,
    isNewMode,
    formatMessage,
    changePageTitle,
    changePageSubtitle,
  ]);

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
              ? 'the_estimate_has_been_successfully_edited'
              : 'the_estimate_has_been_successfully_created',
          },
          { number: values.estimate_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      if (submitPayload.redirect) {
        history.push('/estimates');
      }
    };

    const onError = (errors) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };

    if (estimate && estimate.id) {
      requestEditEstimate(estimate.id, form).then(onSuccess).catch(onError);
    } else {
      requestSubmitEstimate(form).then(onSuccess).catch(onError);
    }
  };

  const handleEstimateNumberChange = useCallback(
    (estimateNumber) => {
      changePageSubtitle(
        defaultToTransform(estimateNumber, `No. ${estimateNumber}`, ''),
      );
    },
    [changePageSubtitle],
  );

  const handleSubmitClick = useCallback(
    (event) => {
      setSubmitPayload({ redirect: true });
    },
    [setSubmitPayload],
  );

  const handleCancelClick = useCallback(
    (event) => {
      history.goBack();
    },
    [history],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_ESTIMATE)}>
      <Formik
        validationSchema={
          isNewMode ? CreateEstimateFormSchema : EditEstimateFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <EstimateFormHeader
              onEstimateNumberChanged={handleEstimateNumberChange}
            />
            <EstimateNumberWatcher estimateNumber={estimateNumber} />
            <EditableItemsEntriesTable filterSellableItems={true} />
            <EstimateFormFooter />
            <EstimateFloatingActions
              isSubmiting={isSubmitting}
              estimateId={estimateId}
              onSubmitClick={handleSubmitClick}
              onCancelClick={handleCancelClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default compose(
  withEstimateActions,
  withEstimateDetail(),
  withDashboardActions,
  withMediaActions,
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
  })),
)(EstimateForm);
