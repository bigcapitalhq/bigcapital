// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ApiKeyDisplayDialogContent = React.lazy(
  () => import('./ApiKeyDisplayDialogContent'),
);

/**
 * API Key Display dialog - shows the generated API key once.
 */
function ApiKeyDisplayDialog({ dialogName, payload: { apiKey } = {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'api_keys.dialog.display_title'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--api-key-display'}
      style={{ width: '600px' }}
    >
      <DialogSuspense>
        <ApiKeyDisplayDialogContent dialogName={dialogName} apiKey={apiKey} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ApiKeyDisplayDialog);
