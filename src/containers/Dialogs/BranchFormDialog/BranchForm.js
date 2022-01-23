import React from 'react';
import { Formik } from 'formik';

import { AppToaster } from 'components';
import { CreateBranchFormSchema } from './BranchForm.schema';

import BranchFormContent from './BranchFormContent';
import { useBranchFormContext } from './BranchFormProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const defaultInitialValues = {
  branch_name: '',
  branch_address_1: '',
  branch_address_2: '',
  phone_number: '',
  email: '',
  website: '',
  branch_address_city: '',
  branch_address_country: '',
};

function BranchForm({
  // #withDialogActions
  closeDialog,
}) {
  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {};

  return (
    <Formik
      validationSchema={CreateBranchFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BranchFormContent}
    />
  );
}
export default compose(withDialogActions)(BranchForm);
