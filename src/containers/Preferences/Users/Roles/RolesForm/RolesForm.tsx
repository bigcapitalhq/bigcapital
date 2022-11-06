// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { Intent } from '@blueprintjs/core';

import '@/style/pages/Preferences/Roles/Form.scss';

import { AppToaster, FormattedMessage as T } from '@/components';
import { CreateRolesFormSchema, EditRolesFormSchema } from './RolesForm.schema';
import { useRolesFormContext } from './RolesFormProvider';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import RolesFormContent from './RolesFormContent';
import {
  getNewRoleInitialValues,
  transformToArray,
  transformToObject,
} from './utils';
import { handleDeleteErrors } from '../utils';
import { compose, transformToForm } from '@/utils';

const defaultValues = {
  role_name: '',
  role_description: '',
  permissions: {},
  serviceFullAccess: {},
};

/**
 *  Preferences - Roles Form.
 */
function RolesForm({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
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
  const initialValues = {
    ...defaultValues,
    ...(!isEmpty(role)
      ? transformToForm(transformToObject(role), defaultValues)
      : getNewRoleInitialValues(permissionsSchema)),
  };
  React.useEffect(() => {
    changePreferencesPageTitle(<T id={'roles.label'} />);
  }, [changePreferencesPageTitle]);

  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
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

    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
      handleDeleteErrors(errors);
    };
    if (isNewMode) {
      createRolePermissionMutate(form).then(onSuccess).catch(onError);
    } else {
      editRolePermissionMutate([roleId, form]).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isNewMode ? CreateRolesFormSchema : EditRolesFormSchema}
      onSubmit={handleFormSubmit}
    >
      <RolesFormContent />
    </Formik>
  );
}

export default compose(withDashboardActions)(RolesForm);
