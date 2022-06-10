import React from 'react';
import intl from 'react-intl-universal';

import { Menu, MenuDivider, MenuItem, Intent } from '@blueprintjs/core';

import { Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Table actions cell.
 */
export const ActionsMenu = ({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails, onNewTask },
}) => (
  <Menu>
    <MenuItem
      icon={<Icon icon="reader-18" />}
      text={intl.get('view_details')}
      onClick={safeCallback(onViewDetails, original)}
    />
    <MenuDivider />
    <MenuItem
      icon={<Icon icon="pen-18" />}
      text={'Edit Project'}
      onClick={safeCallback(onEdit, original)}
    />
    <MenuItem
      icon={<Icon icon="plus" />}
      text={'New Task'}
      onClick={safeCallback(onNewTask, original)}
    />
    <MenuDivider />
    <MenuItem
      text={'Delete Project'}
      icon={<Icon icon="trash-16" iconSize={16} />}
      intent={Intent.DANGER}
      onClick={safeCallback(onDelete, original)}
    />
  </Menu>
);

/**
 * Retrieve projects list columns columns.
 */
export const useProjectsListColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: 'Project Name',
        accessor: 'name',
        width: 100,
        className: 'name',
        clickable: true,
      },
    ],
    [],
  );
};
