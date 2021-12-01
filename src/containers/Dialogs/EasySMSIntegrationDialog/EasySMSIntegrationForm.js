import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import '../../../style/pages/EasySMSIntegration/EasySMSIntegration.scss';

import { AppToaster } from 'components';
import EasySMSIntegrationFormContent from './EasySMSIntegrationFormContent';
import { CreateEasySMSIntegrationSchema } from './EasySMSIntegrationForm.schema';
import { useEasySMSIntegration } from './EasySMSIntegrationProvider';

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
  const { dialogName, easySMSIntegrateMutate } = useEasySMSIntegration();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('easysms.integrate.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };
    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };

    easySMSIntegrateMutate(values).then(onSuccess).catch(onError);
  };

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
