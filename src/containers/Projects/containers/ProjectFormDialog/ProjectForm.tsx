// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { AppToaster } from 'components';
import ProjectFormContent from './ProjectFormContent';
import { CreateProjectFormSchema } from './ProjectForm.schema';
import { useProjectFormContext } from './ProjectFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  contact: '',
  projectName: '',
  projectDeadline: moment(new Date()).format('YYYY-MM-DD'),
  projectState: true,
  projectCost: '',
};

/**
 * Project form
 * @returns
 */
function ProjectForm({
  // #withDialogActions
  closeDialog,
}) {
  // project form dialog context.
  const { dialogName } = useProjectFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {};

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({});
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
  };

  return (
    <Formik
      validationSchema={CreateProjectFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectFormContent}
    />
  );
}

export default compose(withDialogActions)(ProjectForm);
