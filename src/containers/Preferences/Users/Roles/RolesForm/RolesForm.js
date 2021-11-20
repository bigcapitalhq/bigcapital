import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';

import 'style/pages/Preferences/Roles/Form.scss';

import { Intent } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from 'components';

import { CreateRolesFormSchema, EditRolesFormSchema } from './RolesForm.schema';

import { useRolesFormContext } from './RolesFormProvider';

import RolesFormContent from './RolesFormContent';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

const defaultValues = {
  role_name: 'Default',
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
  const { createRoleMutate, editRoleMutate, permissions } =
    useRolesFormContext();

  // Initial values.
  const initialValues = {
    ...defaultValues,
  };

  const MapperPermissionSchema = (data) => {
    return data.map(({ role_name, role_description, permissions }) => {
      const permission = _.mapKeys(permissions, (value, key) => {
        return value;
      });
      return {
        role_name: role_name,
        role_description: role_description,
        permissions: [permission],
      };
    });
  };

  React.useEffect(() => {
    changePreferencesPageTitle(<T id={'roles.label'} />);
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    const form = {
      ...values,
    };

    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: '',
        intent: Intent.SUCCESS,
      });
    };
    // Handle the request error.
    const onError = (
      {
        // response: {
        //   data: { errors },
        // },
      },
    ) => {
      setSubmitting(false);
    };

    createRoleMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateRolesFormSchema}
      onSubmit={handleFormSubmit}
      component={RolesFormContent}
    />
  );
}

export default compose(withDashboardActions)(RolesForm);
