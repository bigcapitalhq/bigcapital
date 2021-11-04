import React from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CLASSES } from 'common/classes';

import { CreateSMSMessageTemplateSchema } from './SMSMessageTemplateForm.schema';

import SMSMessageTemplateFormContent from './SMSMessageTemplateFormContent';

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

export default function SMSMessageTemplateForm({}) {
  // Form initial values.
  const initialValues = {
    ...defaultInitialValues,
  };

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
