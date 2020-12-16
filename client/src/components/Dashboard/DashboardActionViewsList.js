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
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Icon } from 'components';

export default function DashboardActionViewsList({
  resourceName,
  views,
  onChange,
}) {
  const history = useHistory();

  const handleClickViewItem = (view) => {
    history.push(
      view ? `/${resourceName}/${view.id}/custom_view` : '/accounts',
    );
    onChange && onChange(view);
  };
  const viewsMenuItems = views.map((view) => {
    return (
      <MenuItem onClick={() => handleClickViewItem(view)} text={view.name} />
    );
  });

  return (
    <Popover
      content={<Menu>{viewsMenuItems}</Menu>}
      minimal={true}
      interactionKind={PopoverInteractionKind.HOVER}
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
