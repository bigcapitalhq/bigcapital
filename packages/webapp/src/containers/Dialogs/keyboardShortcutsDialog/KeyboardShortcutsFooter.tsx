// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

function KeyboardShortcutsFooterInner({
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

export const KeyboardShortcutsFooter = flow(withDialogActions)(
  KeyboardShortcutsFooterInner,
);
