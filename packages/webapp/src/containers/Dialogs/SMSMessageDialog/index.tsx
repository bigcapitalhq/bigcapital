import React from 'react';
import intl from 'react-intl-universal';
import type { SMSMessageDialogPayload } from './types';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const SMSMessageDialogContent = React.lazy(() =>
  import('./SMSMessageDialogContent').then((m) => ({
    default: m.SMSMessageDialogContent,
  })),
);

interface SMSMessageDialogProps {
  dialogName: string;
  payload: SMSMessageDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * SMS Message dialog.
 */
function SMSMessageDialog({
  dialogName,
  payload: { notificationkey } = {},
  isOpen,
}: SMSMessageDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={intl.get('sms_message.dialog.label')}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--sms-message'}
    >
      <DialogSuspense>
        <SMSMessageDialogContent
          dialogName={dialogName}
          notificationkey={notificationkey ?? ''}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(SMSMessageDialog);
