import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { pick } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { InviteUserFormSchema } from './InviteUserDialog.schema';
import { InviteUserFormContent } from './InviteUserFormContent';
import { useInviteUserFormContext } from './InviteUserFormProvider';
import { transformApiErrors } from './utils';
import type { InviteUserBody } from '@bigcapital/sdk-ts';
import type { InviteUserFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const initialValues: InviteUserFormValues = {
  email: '',
  roleId: '',
};

interface InviteUserFormProps extends WithDialogActionsProps {}

function InviteUserFormInner({
  closeDialog,
}: InviteUserFormProps): React.ReactElement {
  const { dialogName, isEditMode, inviteUserMutate, userId } =
    useInviteUserFormContext();

  const initialFormValues: InviteUserFormValues = {
    ...initialValues,
    status: 1,
    ...(isEditMode &&
      (pick(
        userId,
        Object.keys(InviteUserFormSchema.fields ?? {}),
      ) as Partial<InviteUserFormValues>)),
  };

  const handleSubmit = (
    values: InviteUserFormValues,
    { setSubmitting, setErrors }: FormikHelpers<InviteUserFormValues>,
  ) => {
    const form = { ...values };

    // Handle close the dialog after success response.
    const afterSubmit = () => {
      closeDialog(dialogName);
    };
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('teammate_invited_to_organization_account'),
        intent: Intent.SUCCESS,
      });
      afterSubmit();
    };

    // Handle the response error.
    const onError = (error: { data: { errors: Array<{ type: string }> } }) => {
      const {
        data: { errors },
      } = error;

      const errorsTransformed = transformApiErrors(errors);

      setErrors({ ...errorsTransformed });
      setSubmitting(false);
    };
    // Form keeps `roleId: number | string` for Yup validation ergonomics; the
    // runtime value is a number when valid. Cast narrows to the SDK body shape.
    inviteUserMutate(form as InviteUserBody)
      .then(onSuccess)
      .catch(onError);
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
export const InviteUserForm = compose(withDialogActions)(InviteUserFormInner);
