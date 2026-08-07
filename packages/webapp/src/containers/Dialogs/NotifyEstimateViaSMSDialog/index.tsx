import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const NotifyEstimateViaSMSDialogContent = React.lazy(() =>
  import('./NotifyEstimateViaSMSDialogContent').then((m) => ({
    default: m.NotifyEstimateViaSMSDialogContent,
  })),
);

interface NotifyEstimateViaSMSDialogProps {
  dialogName: string;
  payload: { estimateId?: number | null };
  isOpen: boolean | undefined;
}

function NotifyEstimateViaSMSDialog({
  dialogName,
  payload: { estimateId } = {},
  isOpen,
}: NotifyEstimateViaSMSDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--notify-vis-sms'}
    >
      <DialogSuspense>
        <NotifyEstimateViaSMSDialogContent
          dialogName={dialogName}
          estimate={estimateId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(NotifyEstimateViaSMSDialog);
