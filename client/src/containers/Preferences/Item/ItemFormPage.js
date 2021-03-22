import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
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
  //# withDashboardActions
  changePreferencesPageTitle,
}) {
  const { formatMessage } = useIntl();
  const { saveSettingMutate } = useItemFormContext();

  const initialValues = {
    ...transformGeneralSettings(itemsSettings),
  };

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'items' }));
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'items' };
    });

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
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <Formik
          initialValues={initialValues}
          validationSchema={ItemPreferencesSchema}
          onSubmit={handleFormSubmit}
          component={ItemForm}
        />
      </div>
    </div>
  );
}

export default compose(
  withSettings(({ itemsSettings }) => ({ itemsSettings })),
  withDashboardActions,
)(ItemFormPage);
