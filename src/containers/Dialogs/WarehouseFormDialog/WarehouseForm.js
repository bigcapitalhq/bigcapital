import React from 'react';
import { Formik } from 'formik';

import { CreateWarehouseFormSchema } from './WarehouseForm.schema';
import { useWarehouseFormContext } from './WarehouseFormProvider';
import WarehouseFormContent from './WarehouseFormContent';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const defaultInitialValues = {
  warehouse_name: '',
  warehouse_address_1: '',
  warehouse_address_2: '',
  warehouse_address_city: '',
  warehouse_address_country: '',
  phone_number: '',
};

/**
 * Warehouse form.
 * @returns
 */
function WarehouseForm({
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
      validationSchema={CreateWarehouseFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={WarehouseFormContent}
    />
  );
}

export default compose(withDialogActions)(WarehouseForm);
