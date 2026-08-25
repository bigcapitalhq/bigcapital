import React, { lazy } from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const KeyboardShortcutsContent = lazy(() =>
  import('./KeyboardShortcutsDialogContent').then((m) => ({
    default: m.KeyboardShortcutsDialogContent,
  })),
);

interface KeyboardShortcutsDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Keyboard shortcuts dialog.
 */
function KeyboardShortcutsDialog({
  dialogName,
  isOpen,
}: KeyboardShortcutsDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      isOpen={isOpen}
      className={'dialog--keyboard-shortcuts'}
      // FIXME: original code passed `canEscapeKeyClose` to `<T>` FormattedMessage
      // by mistake; moved to `<Dialog>` where it belongs.
      canEscapeKeyClose={true}
      title={<T id={'keyboard_shortcuts'} />}
    >
      <DialogSuspense>
        <KeyboardShortcutsContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(KeyboardShortcutsDialog);
