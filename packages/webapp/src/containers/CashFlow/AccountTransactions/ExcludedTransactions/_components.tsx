// @ts-nocheck
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';

export function ActionsMenu({ payload: { onRestore }, row: { original } }) {
  return (
    <Menu>
      <MenuItem text={'Restore'} onClick={safeCallback(onRestore, original)} />
    </Menu>
  );
}
