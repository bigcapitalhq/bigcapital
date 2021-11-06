import React from 'react';

import 'style/pages/NotifyConactViaSMS/NotifyConactViaSMSDialog.scss';
import { NotifyContactViaSMSFormProvider } from './NotifyContactViaSMSFormProvider';
import NotifyContactViaSMSForm from './NotifyContactViaSMSForm';

/**
 * Notify contact via SMS.
 */
export default function NotifyContactViaSMSContent({
  // #ownProps
  dialogName,
  invoice,
}) {
  return (
    <NotifyContactViaSMSFormProvider
      invoiceId={invoice}
      dialogName={dialogName}
    >
      <NotifyContactViaSMSForm />
    </NotifyContactViaSMSFormProvider>
  );
}
