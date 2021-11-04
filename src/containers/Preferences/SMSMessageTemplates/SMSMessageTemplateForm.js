import React from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { CreateSMSMessageTemplateSchema } from './SMSMessageTemplateForm.schema';
import SMSMessageTemplateFormContent from './SMSMessageTemplateFormContent';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

export const defaultInitialValues = {
  entries: [
    {
      notification: '',
      service: '',
      message: '',
      auto: true,
      switch: true,
    },
  ],
};

function SMSMessageTemplateForm({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  // Form initial values.
  const initialValues = {
    ...defaultInitialValues,
  };

  React.useEffect(() => {
    changePreferencesPageTitle(
      intl.get('sms_message_template.label.sms_messages_template'),
    );
  }, [changePreferencesPageTitle]);

  // Handles form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {};

  return (
    <div
      className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_STRIP_STYLE)}
    >
      <Formik
        validationSchema={CreateSMSMessageTemplateSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        component={SMSMessageTemplateFormContent}
      />
    </div>
  );
}
export default compose(withDashboardActions)(SMSMessageTemplateForm);
