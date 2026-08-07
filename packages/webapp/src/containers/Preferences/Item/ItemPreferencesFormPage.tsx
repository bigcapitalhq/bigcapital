import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/Preferences/Accounting.scss';
import { ItemPreferencesSchema } from './ItemPreferences.schema';
import {
  ItemForm as ItemPreferencesForm,
  type ItemPreferencesFormValues,
} from './ItemPreferencesForm';
import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import {
  compose,
  optionsMapToArray,
  transformToForm,
  transfromToSnakeCase,
} from '@/utils';

const defaultFormValues: ItemPreferencesFormValues = {
  preferredSellAccount: '',
  preferredCostAccount: '',
  preferredInventoryAccount: '',
};

interface ItemPreferencesFormPageProps extends WithDashboardActionsProps {}

function ItemPreferencesFormPageInner({
  changePreferencesPageTitle,
}: ItemPreferencesFormPageProps): React.ReactElement {
  const { itemsSettings, saveSettingMutate } = useItemPreferencesFormContext();

  const initialValues: ItemPreferencesFormValues = {
    ...defaultFormValues,
    ...transformToForm(itemsSettings, defaultFormValues),
  };

  useEffect(() => {
    changePreferencesPageTitle(intl.get('items'));
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (
    values: ItemPreferencesFormValues,
    { setSubmitting }: FormikHelpers<ItemPreferencesFormValues>,
  ) => {
    const options = optionsMapToArray(
      transfromToSnakeCase({
        preferredSellAccount: values.preferredSellAccount,
        preferredCostAccount: values.preferredCostAccount,
        preferredInventoryAccount: values.preferredInventoryAccount,
      }),
    ).map((option) => ({
      ...option,
      group: 'items',
    }));

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('the_items_preferences_has_been_saved'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    const onError = () => {
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

export const ItemPreferencesFormPage = compose(withDashboardActions)(
  ItemPreferencesFormPageInner,
);
