import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { mapKeys, snakeCase } from 'lodash';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { AppToaster } from 'components';
import GeneralForm from './GeneralForm';
import { PreferencesGeneralSchema } from './General.schema';
import { useGeneralFormContext } from './GeneralFormProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, optionsMapToArray } from 'utils';

import 'style/pages/Preferences/GeneralForm.scss';

/**
 * Preferences - General form Page.
 */
function GeneralFormPage({
  // #withSettings
  organizationSettings,

  //# withDashboardActions
  changePreferencesPageTitle,
}) {
  
  const { saveSettingMutate } = useGeneralFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('general'));
  }, [changePreferencesPageTitle]);

  function transformGeneralSettings(data) {
    return mapKeys(data, (value, key) => snakeCase(key));
  }

  const initialValues = {
    ...transformGeneralSettings(organizationSettings),
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'organization' };
    });
    // Handle request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: 'The general preferences has been saved.',
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();
    };
    // Handle request error.
    const onError = (errors) => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PreferencesGeneralSchema}
      onSubmit={handleFormSubmit}
      component={GeneralForm}
    />
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({ organizationSettings })),
  withDashboardActions,
)(GeneralFormPage);
