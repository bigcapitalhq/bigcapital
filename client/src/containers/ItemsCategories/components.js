import React from 'react';
import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditCategory, onDeleteCategory },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_category' })}
        onClick={safeCallback(onEditCategory, original)}
      />
      <MenuDivider />
      <MenuItem
        text={formatMessage({ id: 'delete_category' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteCategory, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Table actions cell.
 */
export function TableActionsCell(props) {
  return (
    <Popover
      content={<ActionMenuList {...props} />}
      position={Position.RIGHT_TOP}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}
