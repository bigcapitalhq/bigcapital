// @ts-nocheck
import React from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const NotifyEstimateViaSMSDialogContent = React.lazy(() =>
  import('./NotifyEstimateViaSMSDialogContent').then((m) => ({
    default: m.NotifyEstimateViaSMSDialogContent,
  })),
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

export const index = flow(withDialogRedux())(
  NotifyEstimateViaSMSDialog,
);
