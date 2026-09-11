import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface KeyboardShortcutsFooterProps extends WithDialogActionsProps {}

function KeyboardShortcutsFooterInner({
  closeDialog,
}: KeyboardShortcutsFooterProps): React.ReactElement {
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

export const KeyboardShortcutsFooter = FF.pipe(
  KeyboardShortcutsFooterInner,
  withDialogActions,
);
