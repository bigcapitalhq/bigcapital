// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import '@/style/pages/AllocateLandedCost/AllocateLandedCostForm.scss';

import { AppToaster } from '@/components';
import { AllocateLandedCostFormSchema } from './AllocateLandedCostForm.schema';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostFormContent from './AllocateLandedCostFormContent';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';
import { defaultInitialValues } from './utils';

/**
 * Allocate landed cost form.
 */
function AllocateLandedCostForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, bill, billId, createLandedCostMutate } =
    useAllocateLandedConstDialogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    items: bill.entries.map((entry) => ({
      ...entry,
      entry_id: entry.id,
      cost: '',
    })),
  };
  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    // Filters the entries has no cost.
    const entries = values.items
      .filter((entry) => entry.entry_id && entry.cost)
      .map((entry) => transformToForm(entry, defaultInitialValues.items[0]));

    if (entries.length <= 0) {
      AppToaster.show({
        message: intl.get('something_wrong'),
        intent: Intent.DANGER,
      });
      return;
    }
    const form = {
      ...values,
      items: entries,
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('the_landed_cost_has_been_created_successfully'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };
    // Handle the request error.
    const onError = (res) => {
      const { errors } = res.response.data;
      setSubmitting(false);

      if (
        errors.some(
          (e) => e.type === 'COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT',
        )
      ) {
        AppToaster.show({
          message: intl.get(
            'landed_cost.error.the_total_located_cost_is_bigger_than_the_transaction_line',
          ),
          intent: Intent.DANGER,
        });
      } else {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      }
    };
    createLandedCostMutate([billId, form]).then(onSuccess).catch(onError);
  };

  // Computed validation schema.
  const validationSchema = AllocateLandedCostFormSchema();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={AllocateLandedCostFormContent}
    />
  );
}

export default compose(withDialogActions)(AllocateLandedCostForm);
