import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import moment from 'moment';
import { pick, omit } from 'lodash';

import 'style/pages/AllocateLandedCost/AllocateLandedCostForm.scss';

import { AppToaster } from 'components';
import { AllocateLandedCostFormSchema } from './AllocateLandedCostForm.schema';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostFormContent from './AllocateLandedCostFormContent';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const defaultInitialValues = {
  transaction_type: 'Bill',
  transaction_date: moment(new Date()).format('YYYY-MM-DD'),
  transaction_id: '',
  transaction_entry_id: '',
  amount: '',
  allocation_method: 'quantity',
  items: {
    entry_id: '',
    cost: '',
  },
};

/**
 * Allocate landed cost form.
 */
function AllocateLandedCostForm({
  // #withDialogActions
  closeDialog,
}) {
  const { items, dialogName, createLandedCostMutate } =
    useAllocateLandedConstDialogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    ...items,
  };

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    closeDialog(dialogName);

    const entries = [values]
      .filter((entry) => entry.id && entry.cost)
      .map((entry) => ({
        entry_id: entry.id,
        ...pick(entry, ['cost']),
      }));

    const form = {
      ...values,
      // items:{entries},
    };

    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('the_landed_cost_has_been_created_successfully'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };
    createLandedCostMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={AllocateLandedCostFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={AllocateLandedCostFormContent}
    />
  );
}

export default compose(withDialogActions)(AllocateLandedCostForm);
