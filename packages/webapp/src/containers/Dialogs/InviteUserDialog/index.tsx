import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux, {
  DialogBaseProps,
} from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const UserFormDialogContent = lazy(() =>
  import('./InviteUserDialogContent').then((m) => ({
    default: m.InviteUserDialogContent,
  })),
);

interface UserFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: { action: string; id: number | null };
}

function UserFormDialog({
  dialogName,
  payload = { action: '', id: null },
  isOpen,
}: UserFormDialogProps) {
  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_invite'} />
        ) : (
          <T id={'invite_user'} />
        )
      }
      className={'dialog--invite-form'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <UserFormDialogContent
          dialogName={dialogName}
          userId={payload.id}
          action={payload.action}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(UserFormDialog);
