import React from 'react';
import { Form } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import SMSMessageTemplateFormBody from './SMSMessageTemplateFormBody';
import SMSMessageTemplateFloatingAction from './SMSMessageTemplateFloatingAction';

export default function SMSMessageTemplateFormContent() {
  return (
    <Form>
      <SMSMessageTemplateFormBody />
      <SMSMessageTemplateFloatingAction />
    </Form>
  );
}
