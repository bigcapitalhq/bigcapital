import React, { lazy } from 'react';
import type { UserFormDialogPayload } from './types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const UserFormDialogContent = lazy(() =>
  import('./UserFormDialogContent').then((m) => ({
    default: m.UserFormDialogContent,
  })),
);

interface UserFormDialogProps {
  dialogName: string;
  payload: UserFormDialogPayload;
  isOpen: boolean | undefined;
}

function UserFormDialog({
  dialogName,
  payload = { action: '', userId: null },
  isOpen,
}: UserFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'edit_user'} />}
      className={'dialog--user-form'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <UserFormDialogContent
          dialogName={dialogName}
          userId={payload.userId}
          action={payload.action}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(UserFormDialog);
