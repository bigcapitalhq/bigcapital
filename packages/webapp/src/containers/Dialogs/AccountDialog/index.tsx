import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux, {
  DialogBaseProps,
} from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const AccountDialogContent = lazy(() =>
  import('./AccountDialogContent').then((m) => ({
    default: m.AccountDialogContent,
  })),
);

interface AccountFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: { action: string; id: number | null };
}

function AccountFormDialog({
  dialogName,
  payload = { action: '', id: null },
  isOpen,
}: AccountFormDialogProps) {
  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_account'} />
        ) : (
          <T id={'new_account'} />
        )
      }
      className={'dialog--account-form'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <AccountDialogContent dialogName={dialogName} payload={payload} />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(AccountFormDialog);
