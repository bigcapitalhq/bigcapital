import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const KeyboardShortcutsContent = lazy(() =>
  import('./KeyboardShortcutsDialogContent'),
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

export default compose(withDialogRedux())(KeyboardShortcutsDialog);
