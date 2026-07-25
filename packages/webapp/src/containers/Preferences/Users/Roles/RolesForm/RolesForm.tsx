import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';

import '@/style/pages/Preferences/Roles/Form.scss';

import { handleDeleteErrors } from '../utils';
import { CreateRolesFormSchema, EditRolesFormSchema } from './RolesForm.schema';
import { RolesFormContent } from './RolesFormContent';
import { useRolesFormContext } from './RolesFormProvider';
import type { RolesFormValues } from './types';
import {
  getNewRoleInitialValues,
  transformToArray,
  transformToObject,
} from './utils';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { compose, transformToForm } from '@/utils';

const defaultValues: RolesFormValues = {
  role_name: '',
  role_description: '',
  permissions: {},
  serviceFullAccess: {},
};

interface RoleErrorPayload {
  data: { errors: Array<{ type: string }> };
}

type RolesFormInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 *  Preferences - Roles Form.
 */
function RolesFormInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: RolesFormInnerProps) {
  // History context.
  const history = useHistory();

  // Role form context.
  const {
    isNewMode,
    createRolePermissionMutate,
    editRolePermissionMutate,
    permissionsSchema,
    role,
    roleId,
  } = useRolesFormContext();

  // Initial values.
  const initialValues: RolesFormValues = {
    ...defaultValues,
    ...(!isEmpty(role)
      ? (transformToForm(
          transformToObject(role as never),
          defaultValues,
        ) as Partial<RolesFormValues>)
      : (getNewRoleInitialValues(
          (permissionsSchema as never) || [],
        ) as Partial<RolesFormValues>)),
  };
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('roles.label'));
  }, [changePreferencesPageTitle]);

  // Handle the form submit.
  const handleFormSubmit = (
    values: RolesFormValues,
    { setSubmitting }: FormikHelpers<RolesFormValues>,
  ) => {
    const permission = transformToArray(values);
    const form = {
      ...values,
      permissions: permission,
    };
    setSubmitting(true);
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'roles.permission_schema.success_message'
            : 'roles.permission_schema.upload_message',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      history.push('/preferences/users');
    };

    const onError = ({ data: { errors } }: RoleErrorPayload) => {
      setSubmitting(false);
      handleDeleteErrors(errors);
    };
    if (isNewMode) {
      createRolePermissionMutate(form as never)
        .then(onSuccess)
        .catch(onError);
    } else {
      editRolePermissionMutate([roleId, form] as never)
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Formik<RolesFormValues>
      initialValues={initialValues}
      validationSchema={isNewMode ? CreateRolesFormSchema : EditRolesFormSchema}
      onSubmit={handleFormSubmit}
    >
      <RolesFormContent />
    </Formik>
  );
}

export const RolesForm = compose(withDashboardActions)(RolesFormInner);
