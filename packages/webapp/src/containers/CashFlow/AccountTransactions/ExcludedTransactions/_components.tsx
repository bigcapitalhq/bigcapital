import { Menu, MenuItem } from '@blueprintjs/core';
import React from 'react';
import type { ExcludedTransactionRow } from './_utils';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

interface ActionsMenuProps {
  row: { original: ExcludedTransactionRow };
  payload: { onRestore: (transaction: ExcludedTransactionRow) => void };
}

export function ActionsMenu({
  payload: { onRestore },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        text={'Restore'}
        icon={<Icon icon="redo" iconSize={16} />}
        onClick={safeCallback(onRestore, original)}
      />
    </Menu>
  );
}
