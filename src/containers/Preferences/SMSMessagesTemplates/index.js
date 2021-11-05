import React from 'react';

import { SMSMessagesTemplatesProvider } from './SMSMessagesTemplatesProvider';
import SMSMessagesTemplatesDataTable from './SMSMessagesTemplatesDataTable';

/**
 * SMS messages templates.
 */
export default function SMSMessagesTemplates() {
  return (
    <SMSMessagesTemplatesProvider>
      <SMSMessagesTemplatesDataTable />
    </SMSMessagesTemplatesProvider>
  );
}
