import React, { lazy } from 'react';
import type { AccountDialogPayload } from './types';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux, {
  DialogBaseProps,
} from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const AccountDialogContent = lazy(() =>
  import('./AccountDialogContent').then((m) => ({
    default: m.AccountDialogContent,
  })),
);

interface AccountFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: AccountDialogPayload;
}

function AccountFormDialog({
  dialogName,
  payload = { action: '', accountId: null },
  isOpen,
}: AccountFormDialogProps): React.ReactElement {
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
      <DialogSuspense testId={'account-form-dialog'}>
        <AccountDialogContent dialogName={dialogName} payload={payload} />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(AccountFormDialog);
