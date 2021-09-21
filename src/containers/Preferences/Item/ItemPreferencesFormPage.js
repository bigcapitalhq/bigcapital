import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import intl from 'react-intl-universal';
import { ItemPreferencesSchema } from './ItemPreferences.schema';
import ItemPreferencesForm from './ItemPreferencesForm';

import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import { compose, optionsMapToArray, transformGeneralSettings } from 'utils';

import 'style/pages/Preferences/Accounting.scss';

// item form page preferences.
function ItemPreferencesFormPage({
  // #withSettings
  itemsSettings,

  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { saveSettingMutate } = useItemPreferencesFormContext();

  // Initial values.
  const initialValues = {
    preferred_sell_account: '',
    preferred_cost_account: '',
    preferred_inventory_account: '',
    ...transformGeneralSettings(itemsSettings),
  };

  useEffect(() => {
    changePreferencesPageTitle(intl.get('items'));
  }, [changePreferencesPageTitle]);

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const options = optionsMapToArray(values)
      .map((option) => ({ ...option, group: 'items' }));

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('the_items_preferences_has_been_saved'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    const onError = (errors) => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ItemPreferencesSchema}
      onSubmit={handleFormSubmit}
      component={ItemPreferencesForm}
    />
  );
}

export default compose(
  withSettings(({ itemsSettings }) => ({ itemsSettings })),
  withDashboardActions,
)(ItemPreferencesFormPage);
