// @ts-nocheck
import React, { useState } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ApiKeysGenerateDialogContent = React.lazy(
  () => import('./ApiKeysGenerateDialogContent'),
);

/**
 * API Keys Generate dialog.
 */
function ApiKeysGenerateDialog({ dialogName, payload, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={
        <T id={'api_key.dialog.generate_title'} />
      }
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--api-keys-generate'}
      style={{ width: '500px' }}
    >
      <DialogSuspense>
        <ApiKeysGenerateDialogContent
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ApiKeysGenerateDialog);
