import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { mapKeys, omit, pick } from 'lodash';

import 'style/pages/Preferences/Roles/Form.scss';

import { Intent } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from 'components';

import { CreateRolesFormSchema, EditRolesFormSchema } from './RolesForm.schema';

import { useRolesFormContext } from './RolesFormProvider';
import { mapperPermissionSchema } from './utils';

import RolesFormContent from './RolesFormContent';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

const defaultValues = {
  role_name: '',
  role_description: '',
  permissions: {},
};

/**
 *  Preferences - Roles Form.
 */
function RolesForm({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { createRolePermissionMutate, editRolePermissionMutate, permissions } =
    useRolesFormContext();

  // Initial values.
  const initialValues = {
    ...defaultValues,
  };

  React.useEffect(() => {
    changePreferencesPageTitle(<T id={'roles.label'} />);
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (values, { setSubmitting }) => {
    const permission = mapperPermissionSchema(values);
    const form = {
      ...values,
      permissions: permission,
    };
    setSubmitting(true);
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('roles.permisssion_schema.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    const onError = (errors) => {
      setSubmitting(false);
    };
    createRolePermissionMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateRolesFormSchema}
      onSubmit={handleFormSubmit}
    >
      <RolesFormContent />
    </Formik>
  );
}

export default compose(withDashboardActions)(RolesForm);
