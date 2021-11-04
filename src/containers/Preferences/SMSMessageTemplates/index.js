import React from 'react';
import { SMSMessageTemplateProvider } from './SMSMessageTemplateProvider';
import SMSMessageTemplateForm from './SMSMessageTemplateForm';

/**
 * SMS message template.
 */
export default function SMSMessageTemplates() {
  return (
    <SMSMessageTemplateProvider>
      <SMSMessageTemplateForm />
    </SMSMessageTemplateProvider>
  );
}
