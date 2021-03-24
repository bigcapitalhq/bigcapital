import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { useIntl } from 'react-intl';
import { ItemPreferencesSchema } from './Item.schema';
import ItemForm from './ItemForm';

import { useItemFormContext } from './ItemFormProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import { compose, optionsMapToArray, transformGeneralSettings } from 'utils';

import 'style/pages/Preferences/Accounting.scss';

// item form page preferences.
function ItemFormPage({
  // #withSettings
  itemsSettings,

  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { formatMessage } = useIntl();
  const { saveSettingMutate } = useItemFormContext();

  const initialValues = {
    sell_account: '',
    cost_account: '',
    inventory_account: '',
    ...transformGeneralSettings(itemsSettings),
  };

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'items' }));
  }, [formatMessage, changePreferencesPageTitle]);

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const options = optionsMapToArray(values)
      .map((option) => ({ ...option, group: 'items' }));

    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_items_preferences_has_been_saved',
        }),
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
      component={ItemForm}
    />
  );
}

export default compose(
  withSettings(({ itemsSettings }) => ({ itemsSettings })),
  withDashboardActions,
)(ItemFormPage);
