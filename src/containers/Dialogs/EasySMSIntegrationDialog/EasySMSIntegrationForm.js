import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import '../../../style/pages/EasySMSIntegration/EasySMSIntegration.scss';

import { AppToaster } from 'components';
import EasySMSIntegrationFormContent from './EasySMSIntegrationFormContent';
import { CreateEasySMSIntegrationSchema } from './EasySMSIntegrationForm.schema';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const defaultInitialValues = {
  token: '',
};

/**
 * EasySMS Integration form.
 */
function EasySMSIntegrationForm({
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
      validationSchema={CreateEasySMSIntegrationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={EasySMSIntegrationFormContent}
    />
  );
}

export default compose(withDialogActions)(EasySMSIntegrationForm);
