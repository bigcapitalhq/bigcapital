import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { pick, snakeCase } from 'lodash';
import { AppToaster } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';

import { UserFormSchema } from './UserForm.schema';
import UserFormContent from './UserFormContent';
import { useUserFormContext } from './UserFormProvider';
import { transformErrors } from './utils';

import { compose, objectKeysTransform } from 'utils';

/**
 * User form.
 */
function UserForm({
  // #withDialogActions
  closeDialog,
}) {
  const [calloutCode, setCalloutCode] = React.useState([]);

  const { dialogName, user, userId, isEditMode, EditUserMutate } =
    useUserFormContext();

  const initialValues = {
    ...(isEditMode &&
      pick(
        objectKeysTransform(user, snakeCase),
        Object.keys(UserFormSchema.fields),
      )),
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const form = { ...values };

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };

    const onSuccess = ({ response }) => {
      AppToaster.show({
        message: intl.get('teammate_invited_to_organization_account'),
        intent: Intent.SUCCESS,
      });
      afterSubmit(response);
    };

    // Handle the response error.
    const onError = (error) => {
      const {
        response: {
          data: { errors },
        },
      } = error;
      transformErrors(errors, { setErrors, setCalloutCode });
      setSubmitting(false);
    };

    EditUserMutate([userId, form]).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={UserFormSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <UserFormContent calloutCode={calloutCode} />
    </Formik>
  );
}
export default compose(withDialogActions)(UserForm);
