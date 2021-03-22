import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { mapKeys, snakeCase } from 'lodash';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { CLASSES } from 'common/classes';

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
  const { formatMessage } = useIntl();
  const { saveSettingMutate } = useGeneralFormContext();

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'general' }));
  }, [changePreferencesPageTitle, formatMessage]);

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
    const onSuccess = (response) => {
      AppToaster.show({
        message: 'The general preferences has been saved.',
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();
    };
    const onError = (errors) => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_GENERAL,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <Formik
          initialValues={initialValues}
          validationSchema={PreferencesGeneralSchema}
          onSubmit={handleFormSubmit}
          component={GeneralForm}
        />
      </div>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({ organizationSettings })),
  withDashboardActions,
)(GeneralFormPage);
