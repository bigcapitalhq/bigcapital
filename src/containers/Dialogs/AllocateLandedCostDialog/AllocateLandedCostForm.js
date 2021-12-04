import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import 'style/pages/AllocateLandedCost/AllocateLandedCostForm.scss';

import { AppToaster } from 'components';
import { AllocateLandedCostFormSchema } from './AllocateLandedCostForm.schema';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostFormContent from './AllocateLandedCostFormContent';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose, transformToForm } from 'utils';

const defaultInitialItem = {
  entry_id: '',
  cost: '',
};

// Default form initial values.
const defaultInitialValues = {
  transaction_type: 'Bill',
  transaction_id: '',
  transaction_entry_id: '',
  amount: '',
  allocation_method: 'quantity',
  items: [defaultInitialItem],
};

/**
 * Allocate landed cost form.
 */
function AllocateLandedCostForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    bill,
    billId,
    createLandedCostMutate,
    unallocatedCostAmount,
  } = useAllocateLandedConstDialogContext();

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
      AppToaster.show({ message: 'Something wrong!', intent: Intent.DANGER });
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
    const onError = () => {
      setSubmitting(false);
      AppToaster.show({
        message: 'Something went wrong!',
        intent: Intent.DANGER,
      });
    };
    createLandedCostMutate([billId, form]).then(onSuccess).catch(onError);
  };

  // Computed validation schema.
  const validationSchema = AllocateLandedCostFormSchema(unallocatedCostAmount);

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
