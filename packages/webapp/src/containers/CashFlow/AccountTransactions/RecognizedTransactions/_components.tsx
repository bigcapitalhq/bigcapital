// @ts-nocheck
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';

export function ActionsMenu({
  payload: { onCategorize, onExclude },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        text={'Categorize'}
        onClick={safeCallback(onCategorize, original)}
      />
      <MenuDivider />
      <MenuItem text={'Exclude'} onClick={safeCallback(onExclude, original)} />
    </Menu>
  );
}
