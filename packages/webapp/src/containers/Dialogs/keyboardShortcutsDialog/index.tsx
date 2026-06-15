// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const KeyboardShortcutsContent = lazy(() =>
  import('./KeyboardShortcutsDialogContent').then((m) => ({
    default: m.KeyboardShortcutsDialogContent,
  })),
);

/**
 * Keyboard shortcuts dialog.
 */
function KeyboardShortcutsDialog({ dialogName, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      isOpen={isOpen}
      className={'dialog--keyboard-shortcuts'}
      title={<T id={'keyboard_shortcuts'} canEscapeKeyClose={true} />}
    >
      <DialogSuspense>
        <KeyboardShortcutsContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(KeyboardShortcutsDialog);
