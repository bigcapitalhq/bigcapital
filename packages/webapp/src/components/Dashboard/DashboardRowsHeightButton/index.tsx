// @ts-nocheck
import React from 'react';
import {
  Button,
  PopoverInteractionKind,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Classes,
  Tooltip,
  Position,
} from '@blueprintjs/core';
import clsx from 'classnames';
import { Icon, T } from '@/components';

import Style from './style.module.scss';

/**
 * Dashboard rows height button control.
 */
export function DashboardRowsHeightButton({ initialValue, value, onChange }) {
  const [localSize, setLocalSize] = React.useState(initialValue);

  // Handle menu item click.
  const handleItemClick = (size) => (event) => {
    setLocalSize(size);
    onChange && onChange(size, event);
  };
  // Button icon name.
  const btnIcon = `table-row-${localSize}`;

  return (
    <Popover
      minimal={true}
      content={
        <Menu className={Style.menu}>
          <MenuDivider title={<T id={'dashboard.rows_height'} />} />
          <MenuItem
            onClick={handleItemClick('small')}
            text={<T id={'dashboard.row_small'} />}
          />
          <MenuItem
            onClick={handleItemClick('medium')}
            text={<T id={'dashboard.row_medium'} />}
          />
        </Menu>
      }
      placement="bottom-start"
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      interactionKind={PopoverInteractionKind.CLICK}
    >
      <Tooltip
        content={<T id={'dashboard.rows_height'} />}
        minimal={true}
        position={Position.BOTTOM}
      >
        <Button
          className={clsx(Classes.MINIMAL, Style.button)}
          icon={<Icon icon={btnIcon} iconSize={16} />}
        />
      </Tooltip>
    </Popover>
  );
}

DashboardRowsHeightButton.defaultProps = {
  initialValue: 'medium',
};
