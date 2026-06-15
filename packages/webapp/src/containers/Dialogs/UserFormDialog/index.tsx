// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const UserFormDialogContent = lazy(() =>
  import('./UserFormDialogContent').then((m) => ({
    default: m.UserFormDialogContent,
  })),
);

function UserFormDialog({
  dialogName,
  payload = { action: '', userId: null },
  isOpen,
}) {
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

export const index = flow(withDialogRedux())(UserFormDialog);
