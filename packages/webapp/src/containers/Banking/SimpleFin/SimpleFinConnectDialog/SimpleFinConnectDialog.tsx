import * as FF from 'fp-ts/function';
import React from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const SimpleFinConnectDialogContent = React.lazy(() =>
  import('./SimpleFinConnectDialogContent').then((m) => ({
    default: m.SimpleFinConnectDialogContent,
  })),
);

interface SimpleFinConnectDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * SimpleFIN connect bank account dialog.
 */
function SimpleFinConnectDialogRoot({
  dialogName,
  isOpen,
}: SimpleFinConnectDialogProps) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'simplefin.dialog.title'} />}
      isOpen={isOpen}
      canEscapeKeyClose={true}
      canOutsideClickClose={false}
      autoFocus={true}
      style={{ width: 560 }}
    >
      <DialogSuspense testId="simplefin-connect-dialog">
        <SimpleFinConnectDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const SimpleFinConnectDialog = FF.pipe(
  SimpleFinConnectDialogRoot,
  withDialogRedux(),
);

SimpleFinConnectDialog.displayName = 'SimpleFinConnectDialog';
