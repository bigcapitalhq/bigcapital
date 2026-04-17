// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { Intent } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import { CustomFieldsFormSchema } from './CustomFieldsForm.schema';
import { useCustomFieldsFormContext } from './CustomFieldsFormProvider';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import CustomFieldsFormContent from './CustomFieldsFormContent';
import { compose, transformToForm } from '@/utils';

const defaultValues = {
  resourceName: 'Item',
  fieldName: '',
  label: '',
  fieldType: 'text',
  options: {},
  required: false,
  order: 0,
  active: true,
  defaultValue: '',
};

/**
 *  Preferences - Custom Fields Form.
 */
function CustomFieldsForm({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  // History context.
  const history = useHistory();

  // Custom fields form context.
  const {
    isNewMode,
    createCustomFieldMutate,
    editCustomFieldMutate,
    customField,
    customFieldId,
  } = useCustomFieldsFormContext();

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...(!isEmpty(customField)
      ? transformToForm(customField, defaultValues)
      : {}),
  };

  React.useEffect(() => {
    changePreferencesPageTitle(
      isNewMode ? (
        <T id={'custom_fields.new_custom_field'} />
      ) : (
        <T id={'custom_fields.edit_custom_field'} />
      ),
    );
  }, [changePreferencesPageTitle, isNewMode]);

  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'custom_fields.create_success_message'
            : 'custom_fields.edit_success_message',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      history.push('/preferences/custom-fields');
    };

    const onError = (error) => {
      setSubmitting(false);
      AppToaster.show({
        message: intl.get('custom_fields.error_message'),
        intent: Intent.DANGER,
      });
    };

    if (isNewMode) {
      createCustomFieldMutate(values).then(onSuccess).catch(onError);
    } else {
      editCustomFieldMutate([customFieldId, values]).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CustomFieldsFormSchema}
      onSubmit={handleFormSubmit}
    >
      <CustomFieldsFormContent />
    </Formik>
  );
}

export default compose(withDashboardActions)(CustomFieldsForm);
