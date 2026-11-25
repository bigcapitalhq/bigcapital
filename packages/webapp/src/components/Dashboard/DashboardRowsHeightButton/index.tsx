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
import React from 'react';
import Style from './style.module.scss';
import { Icon, T } from '@/components';
import { DEFAULT_TABLE_SIZE, getTableSize } from '@/constants/tables';

interface DashboardRowsHeightButtonProps {
  initialValue?: any;
  value?: any;
  onChange?: (size: any, event?: React.SyntheticEvent) => void;
}

/**
 * Dashboard rows height button control.
 */
export function DashboardRowsHeightButton({
  initialValue = DEFAULT_TABLE_SIZE,
  value,
  onChange,
}: DashboardRowsHeightButtonProps) {
  const [localSize, setLocalSize] = React.useState(
    getTableSize(value ?? initialValue),
  );

  // Keep the local size in sync when the stored preference finishes loading.
  React.useEffect(() => {
    setLocalSize(getTableSize(value ?? initialValue));
  }, [value, initialValue]);

  // Handle menu item click.
  const handleItemClick = (size: string) => (event: React.SyntheticEvent) => {
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
        offset: { options: { offset: [0, 4] } },
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
