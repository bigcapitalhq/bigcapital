import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import React from 'react';
import type { UncategorizedTransactionRow } from './hooks';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

interface ActionsMenuProps {
  row: { original: UncategorizedTransactionRow };
  payload: {
    onCategorize: (transaction: UncategorizedTransactionRow) => void;
    onExclude: (transaction: UncategorizedTransactionRow) => void;
  };
}

export function ActionsMenu({
  payload: { onCategorize, onExclude },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={'Categorize'}
        onClick={safeCallback(onCategorize, original)}
      />
      <MenuDivider />
      <MenuItem
        text={'Exclude'}
        onClick={safeCallback(onExclude, original)}
        icon={<Icon icon="disable" iconSize={16} />}
      />
    </Menu>
  );
}
