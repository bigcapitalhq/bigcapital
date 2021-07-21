import React from 'react';
import { Formik } from 'formik';
import moment from 'moment';

import 'style/pages/AllocateLandedCost/AllocateLandedCostForm.scss';

import { AllocateLandedCostFormSchema } from './AllocateLandedCostForm.schema';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import AllocateLandedCostFormContent from './AllocateLandedCostFormContent';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  transaction_type: 'bills',
  transaction_date: moment(new Date()).format('YYYY-MM-DD'),
  transaction_id: '',
  transaction_entry_id: '',
  amount: '',
  allocation_method: 'quantity',
  entries: {
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
  const { bill, dialogName } = useAllocateLandedConstDialogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    ...bill,
  };


  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {};

  return (
    <Formik
      validationSchema={AllocateLandedCostFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <AllocateLandedCostFormContent />
    </Formik>
  );
}

export default compose(withDialogActions)(AllocateLandedCostForm);
