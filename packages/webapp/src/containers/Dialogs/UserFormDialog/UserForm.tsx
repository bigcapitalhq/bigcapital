import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { UserFormSchema } from './UserForm.schema';
import { UserFormContent } from './UserFormContent';
import { useUserFormContext } from './UserFormProvider';
import { transformErrors } from './utils';
import type { UserFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const initialValues: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
};

interface UserFormProps extends WithDialogActionsProps {}

/**
 * User form.
 */
function UserFormInner({ closeDialog }: UserFormProps): React.ReactElement {
  const [calloutCode, setCalloutCode] = React.useState<number[]>([]);

  const { dialogName, user, userId, isEditMode, EditUserMutate } =
    useUserFormContext();

  const initialFormValues: UserFormValues = {
    ...initialValues,
    ...(isEditMode && transformToForm(user, initialValues)),
  };

  const handleSubmit = (
    values: UserFormValues,
    { setSubmitting, setErrors }: FormikHelpers<UserFormValues>,
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
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      transformErrors(errors, { setErrors, setCalloutCode });
      setSubmitting(false);
    };

    // FIXME: always calls EditUserMutate regardless of create vs edit mode —
    // there is no useCreateUser/useInviteUser wired up; create path is broken
    // at runtime. Preserved to keep this a TS-only slice.
    // @ts-expect-error — `userId` is null in create mode, mutateAsync requires a number.
    EditUserMutate([userId, form]).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={UserFormSchema}
      initialValues={initialFormValues}
      onSubmit={handleSubmit}
    >
      <UserFormContent calloutCode={calloutCode} />
    </Formik>
  );
}
export const UserForm = compose(withDialogActions)(UserFormInner);
