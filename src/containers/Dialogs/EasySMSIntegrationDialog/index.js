import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const EasySMSIntegrationDialogContent = React.lazy(() =>
  import('./EasySMSIntegrationDialogContent'),
);

/**
 * EasySms integration dialog.
 */
function EasySMSIntegrationDialog({ dialogName, payload = {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'EasySMS Inegration'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--easysms-integrate'}
    >
      <DialogSuspense>
        <EasySMSIntegrationDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(EasySMSIntegrationDialog);
