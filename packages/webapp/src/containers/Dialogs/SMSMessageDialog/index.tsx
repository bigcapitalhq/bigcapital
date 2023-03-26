// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

import { compose } from '@/utils';

const SMSMessageDialogContent = React.lazy(() =>
  import('./SMSMessageDialogContent'),
);

/**
 * SMS Message dialog.
 */
function SMSMessageDialog({
  dialogName,
  payload: { notificationkey },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={intl.get('sms_message.dialog.label')}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--sms-message'}
    >
      <DialogSuspense>
        <SMSMessageDialogContent
          dialogName={dialogName}
          notificationkey={notificationkey}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(SMSMessageDialog);
