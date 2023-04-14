// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { pick, snakeCase } from 'lodash';
import { AppToaster } from '@/components';

import withDialogActions from '@/containers/Dialog/withDialogActions';

import { InviteUserFormSchema } from './InviteUserDialog.schema';
import InviteUserFormContent from './InviteUserFormContent';
import { useInviteUserFormContext } from './InviteUserFormProvider';

import { transformApiErrors } from './utils';

import { compose, objectKeysTransform } from '@/utils';

const initialValues = {
  email: '',
  role_id: ''
}

function InviteUserForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, isEditMode, inviteUserMutate, userId } =
    useInviteUserFormContext();

  const initialFormValues = {
    ...initialValues,
    status: 1,
    ...(isEditMode &&
      pick(
        objectKeysTransform(userId, snakeCase),
        Object.keys(InviteUserFormSchema.fields),
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

      const errorsTransformed = transformApiErrors(errors);

      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    inviteUserMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={InviteUserFormSchema}
      initialValues={initialFormValues}
      onSubmit={handleSubmit}
    >
      <InviteUserFormContent />
    </Formik>
  );
}
export default compose(withDialogActions)(InviteUserForm);
