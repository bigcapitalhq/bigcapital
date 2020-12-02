import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { mapKeys, snakeCase } from 'lodash';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useQuery, queryCache } from 'react-query';
import { useIntl } from 'react-intl';
import { CLASSES } from 'common/classes';

import { compose, optionsMapToArray } from 'utils';

import { AppToaster, LoadingIndicator } from 'components';
import GeneralForm from './GeneralForm';
import { PreferencesGeneralSchema } from './General.schema';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';

function GeneralPreferences({
  // #withSettings
  organizationSettings,

  //# withDashboardActions
  changePreferencesPageTitle,

  // #withSettingsActions
  requestSubmitOptions,
  requestFetchOptions,
}) {
  const { formatMessage } = useIntl();

  const fetchSettings = useQuery(['settings'], () => requestFetchOptions());

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
    requestSubmitOptions({ options })
      .then((response) => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_options_has_been_successfully_created',
          }),
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        resetForm();
        queryCache.invalidateQueries('settings');
      })
      .catch((error) => {
        setSubmitting(false);
      });
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_GENERAL,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <LoadingIndicator loading={fetchSettings.isFetching} spinnerSize={28}>
          <Formik
            initialValues={initialValues}
            validationSchema={PreferencesGeneralSchema}
            onSubmit={handleFormSubmit}
            component={GeneralForm}
          />
        </LoadingIndicator>
      </div>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({ organizationSettings })),
  withSettingsActions,
  withDashboardActions,
)(GeneralPreferences);
