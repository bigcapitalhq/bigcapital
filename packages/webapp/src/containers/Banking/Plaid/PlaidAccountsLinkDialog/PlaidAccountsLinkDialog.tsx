import * as FF from 'fp-ts/function';
import React from 'react';
import type { PlaidAccountsLinkPayload } from './PlaidAccountsLinkDialogContent';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const PlaidAccountsLinkDialogContent = React.lazy(() =>
  import('./PlaidAccountsLinkDialogContent').then((m) => ({
    default: m.PlaidAccountsLinkDialogContent,
  })),
);

interface PlaidAccountsLinkDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Links the bank accounts selected in Plaid Link to existing accounts, or
 * lets them be created, before the bank connection is stored.
 */
function PlaidAccountsLinkDialogRoot({
  dialogName,
  payload,
  isOpen,
}: PlaidAccountsLinkDialogProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Link Bank Accounts'}
      isOpen={isOpen}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      autoFocus={true}
      style={{ width: 560 }}
    >
      <DialogSuspense>
        <PlaidAccountsLinkDialogContent
          dialogName={dialogName}
          payload={payload as unknown as PlaidAccountsLinkPayload}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const PlaidAccountsLinkDialog = FF.pipe(
  PlaidAccountsLinkDialogRoot,
  withDialogRedux(),
);

PlaidAccountsLinkDialog.displayName = 'PlaidAccountsLinkDialog';
