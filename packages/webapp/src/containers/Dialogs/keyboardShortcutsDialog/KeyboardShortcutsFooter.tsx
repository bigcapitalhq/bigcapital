// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function KeyboardShortcutsFooter({
  // #withDialogActions
  closeDialog,
}) {
  const handleClose = () => {
    closeDialog('keyboard-shortcuts');
  };

  return (
    <div className={'dialog--keyboard-shortcuts__footer'}>
      <Button intent={Intent.PRIMARY} onClick={handleClose} small={true}>
        <T id={'oK_'} />
      </Button>
    </div>
  );
}

export default compose(withDialogActions)(KeyboardShortcutsFooter);
