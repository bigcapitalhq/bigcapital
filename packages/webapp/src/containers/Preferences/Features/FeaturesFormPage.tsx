import { Intent } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { flatten, unflatten } from 'flat';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { FeaturesSchema } from './Features.schema';
import { FeaturesForm } from './FeaturesForm';
import { useFeaturesFormContext } from './FeaturesFormProvider';
import { transferObjectOptionsToArray } from './utils';
import type { FeaturesFormValues } from './types';
import { AppToaster } from '@/components';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import { usersKeys } from '@/hooks/query/users/query-keys';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

const defaultFormValues = flatten({
  features: {
    landedCost: false,
  },
}) as FeaturesFormValues;

type FeaturesFormPageInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function FeaturesFormPageInner({
  changePreferencesPageTitle,
}: FeaturesFormPageInnerProps) {
  const { allSettings, saveSettingMutate } = useFeaturesFormContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('features.label'));
  }, [changePreferencesPageTitle]);

  const initialValues = unflatten({
    ...defaultFormValues,
    ...transformToForm(flatten(allSettings), defaultFormValues),
  }) as FeaturesFormValues;

  const handleFormSubmit = (
    values: FeaturesFormValues,
    { setSubmitting }: FormikHelpers<FeaturesFormValues>,
  ) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )(values);
    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('features.saved_success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      // Refresh the dashboard boot meta so the feature flags reflect the change.
      queryClient.invalidateQueries({ queryKey: usersKeys.dashboardMeta() });
    };
    const onError = () => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FeaturesSchema}
      onSubmit={handleFormSubmit}
      component={FeaturesForm}
    />
  );
}

export const FeaturesFormPage = compose(withDashboardActions)(
  FeaturesFormPageInner,
);
