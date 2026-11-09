import {
  Button,
  Classes,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Divider,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { FormattedMessage as T } from '@/components';
import { Icon } from '@/components';

export interface DashboardViewItem {
  name?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Dashboard action views list.
 */
export function DashboardActionViewsList({
  resourceName,
  allMenuItem = false,
  allMenuItemText,
  views = [],
  onChange,
}: {
  resourceName: string;
  allMenuItem?: boolean;
  allMenuItemText?: React.ReactNode;
  views: any;
  onChange?: (view: any) => void;
}) {
  const handleClickViewItem = (view: any) => {
    onChange && onChange(view);
  };

  const viewsMenuItems = (views as DashboardViewItem[]).map((view) => (
    <MenuItem onClick={() => handleClickViewItem(view)} text={view.name} />
  ));

  const handleAllTabClick = () => {
    handleClickViewItem(null);
  };

  const content = (
    <Menu>
      {allMenuItem && (
        <>
          <MenuItem
            onClick={handleAllTabClick}
            text={allMenuItemText || 'All'}
          />
          <Divider />
        </>
      )}
      {viewsMenuItems}
    </Menu>
  );

  return (
    <Popover
      content={content}
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
    >
      <Button
        className={classNames(Classes.MINIMAL, 'button--table-views')}
        icon={<Icon icon="table-16" iconSize={16} />}
        text={<T id={'table_views'} />}
        rightIcon={'caret-down'}
      />
    </Popover>
  );
}
