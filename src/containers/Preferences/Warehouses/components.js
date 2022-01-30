import React from 'react';
import intl from 'react-intl-universal';

import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { If, Icon, Can } from '../../../components';
import { safeCallback } from 'utils';

/**
 * Warehouse context menu.
 */
export function WarehouseContextMenu({
  onEditClick,
  onDeleteClick,
  onPrimary,
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.edit_warehouse')}
        onClick={safeCallback(onEditClick)}
      />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouses.action.make_as_parimary')}
        onClick={safeCallback(onPrimary)}
      />
      <MenuDivider />
      <MenuItem
        text={intl.get('warehouses.action.delete_warehouse')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteClick)}
      />
    </Menu>
  );
}
