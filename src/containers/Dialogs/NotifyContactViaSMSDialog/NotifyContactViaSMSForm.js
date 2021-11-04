import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from 'components';
import { CreateNotifyContactViaSMSFormSchema } from './NotifyContactViaSMSForm.schema';

import NotifyContactViaSMSFormContent from './NotifyContactViaSMSFormContent';

import withDialogActions from 'containers/Dialog/withDialogActions';

import { useNotifyContactViaSMSContext } from './NotifyContactViaSMSFormProvider';

import { compose } from 'utils';

const defaultInitialValues = {
  name: '',
  phone: '',
  note: '',
};

function NotifyContactViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName } = useNotifyContactViaSMSContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {};

  return (
    <Formik
      validationSchema={CreateNotifyContactViaSMSFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={NotifyContactViaSMSFormContent}
    />
  );
}
export default compose(withDialogActions)(NotifyContactViaSMSForm);
