import React from 'react';
import { Formik, Form } from 'formik';

import 'style/pages/NotifyConactViaSMS/NotifyConactViaSMSDialog.scss';

import { CreateNotifyViaSMSFormSchema } from './NotifyViaSMSForm.schema';
import NotifyViaSMSFormFields from './NotifyViaSMSFormFields';
import NotifyViaSMSFormFloatingActions from './NotifyViaSMSFormFloatingActions';

import { transformToForm, saveInvoke } from 'utils';

const defaultInitialValues = {
  customer_name: '',
  customer_phone_number: '',
  sms_message: '',
};

/**
 * Notify Via SMS Form.
 */
function NotifyViaSMSForm({ onSubmit, NotificationDetail, NotificationName }) {
  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(NotificationDetail, defaultInitialValues),
  };

  return (
    <Formik
      validationSchema={CreateNotifyViaSMSFormSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Form>
        <NotifyViaSMSFormFields />
        <NotifyViaSMSFormFloatingActions dialogName={NotificationName} />
      </Form>
    </Formik>
  );
}

export default NotifyViaSMSForm;
