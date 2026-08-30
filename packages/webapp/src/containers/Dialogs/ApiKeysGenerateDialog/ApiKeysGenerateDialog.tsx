import React, { lazy } from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ApiKeysGenerateDialogContent = lazy(() =>
  import('./ApiKeysGenerateDialogContent').then((m) => ({
    default: m.ApiKeysGenerateDialogContent,
  })),
);

interface ApiKeysGenerateDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * API keys generate dialog.
 */
function ApiKeysGenerateDialogRoot({
  dialogName,
  isOpen,
}: ApiKeysGenerateDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'api_key.dialog.generate_title'} />}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <ApiKeysGenerateDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const ApiKeysGenerateDialog = compose(withDialogRedux())(
  ApiKeysGenerateDialogRoot,
);
