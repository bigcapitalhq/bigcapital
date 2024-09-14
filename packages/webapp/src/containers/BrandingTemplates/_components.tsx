// @ts-nocheck
import { safeCallback } from '@/utils';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

/**
 * Templates table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onDeleteTemplate, onEditTemplate, onMarkDefaultTemplate },
}) {
  return (
    <Menu>
      {!original.default && (
        <>
          <MenuItem
            text={'Mark as Default'}
            onClick={safeCallback(onMarkDefaultTemplate, original)}
          />
          <MenuDivider />
        </>
      )}
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
