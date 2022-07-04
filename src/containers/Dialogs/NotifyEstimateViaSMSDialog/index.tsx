import React from 'react';

import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'utils';

const NotifyEstimateViaSMSDialogContent = React.lazy(() =>
  import('./NotifyEstimateViaSMSDialogContent'),
);

function NotifyEstimateViaSMSDialog({
  dialogName,
  payload: { estimateId },
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
        <NotifyEstimateViaSMSDialogContent
          dialogName={dialogName}
          estimate={estimateId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(NotifyEstimateViaSMSDialog);
