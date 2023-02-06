// @ts-nocheck
import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
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
import { FormattedMessage as T } from '@/components';
import { Icon } from '@/components';

/**
 * Dashboard action views list.
 */
export function DashboardActionViewsList({
  resourceName,
  allMenuItem,
  allMenuItemText,
  views,
  onChange,
}) {
  const handleClickViewItem = (view) => {
    onChange && onChange(view);
  };

  const viewsMenuItems = views.map((view) => (
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
