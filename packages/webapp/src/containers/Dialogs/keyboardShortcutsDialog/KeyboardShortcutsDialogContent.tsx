import React from 'react';
import { ShortcutsTable } from '../../KeyboardShortcuts/ShortcutsTable';
import { KeyboardShortcutsFooter } from './KeyboardShortcutsFooter';
import { DialogContent } from '@/components';

import '@/style/pages/keyboardShortcuts/KeyboardShortcutDialog.scss';

export function KeyboardShortcutsDialogContent(): React.ReactElement {
  return (
    <DialogContent name={'keyboard-shortcuts'}>
      <ShortcutsTable />
      <KeyboardShortcutsFooter />
    </DialogContent>
  );
}
