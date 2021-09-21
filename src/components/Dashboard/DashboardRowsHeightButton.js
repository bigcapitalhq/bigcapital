import React from 'react';
import {
  Button,
  PopoverInteractionKind,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Classes
} from '@blueprintjs/core';
import { Icon } from 'components';

export function DashboardRowsHeightButton() {
  return (
    <Popover
      minimal={true}
      content={
        <Menu>
          <MenuDivider title={'Rows height'} />
          <MenuItem text="Compact" />
          <MenuItem text="Medium" />
        </Menu>
      }
      placement="bottom-start"
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      interactionKind={PopoverInteractionKind.CLICK}
    >
      <Button
        className={Classes.MINIMAL}
        icon={<Icon icon="rows-height" iconSize={16} />}
      />
    </Popover>
  );
}
