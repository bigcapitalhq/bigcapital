// @ts-nocheck
import React from 'react';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
} from '@blueprintjs/core';
import { Icon, FormattedMessage as T } from '@/components';

/**
 *  Customer more actions menu items.
 * @returns
 */
export function CustomerMoreMenuItem({ payload: { onEditOpeningBalance } }) {
  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <MenuItem
            text={<T id={'customer.drawer.action.edit_opening_balance'} />}
            onClick={onEditOpeningBalance}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
}
