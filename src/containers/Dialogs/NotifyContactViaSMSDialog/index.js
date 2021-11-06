import React from 'react';

import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const NotifyContactViaSMSDialogContent = React.lazy(() =>
  import('./NotifyContactViaSMSContent'),
);

/**
 * Notify contact via SMS.
 */
function NotifyContactViaSMSDialog({
  dialogName,
  payload: { invoiceId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--notify-vis-sms'}
    >
      <DialogSuspense>
        <NotifyContactViaSMSDialogContent
          dialogName={dialogName}
          invoice={invoiceId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(NotifyContactViaSMSDialog);
