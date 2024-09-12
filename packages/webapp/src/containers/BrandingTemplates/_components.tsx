// @ts-nocheck
import { safeCallback } from '@/utils';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

/**
 * Templates table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onDeleteTemplate, onEditTemplate },
}) {
  return (
    <Menu>
      <MenuItem
        text={'Edit Template'}
        onClick={safeCallback(onEditTemplate, original)}
      />
      <MenuDivider />
      <MenuItem
        text={'Delete Template'}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteTemplate, original)}
      />
    </Menu>
  );
}
