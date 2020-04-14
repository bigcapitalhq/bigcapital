import React, { useMemo, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { compose } from 'utils';
import {
  MenuItem,
  Popover,
  NavbarGroup,
  Menu,
  NavbarDivider,
  PopoverInteractionKind,
  Position,
  Button,
  Classes,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import DashboardConnect from 'connectors/Dashboard.connector';
import ResourceConnect from 'connectors/Resource.connector';
import FilterDropdown from 'components/FilterDropdown';
import ItemsConnect from 'connectors/Items.connect';
import DialogConnect from 'connectors/Dialog.connector';

const ItemsActionsBar = ({
  openDialog,
  getResourceFields,
  getResourceViews,
  views,
  onFilterChanged,
  bulkSelected,
  addItemsTableQueries,
}) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const viewsMenuItems = views.map(view => {
    return (
      <MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />
    );
  });

  const onClickNewItem = () => {
    history.push('/dashboard/items/new');
  };
  const itemsFields = getResourceFields('items');

  const filterDropdown = FilterDropdown({
    fields: itemsFields,
    onFilterChange: (filterConditions) => {
      addItemsTableQueries({
        filter_roles: filterConditions || '',  
      });
      onFilterChanged && onFilterChanged(filterConditions);
    }
  });

  const hasBulkActionsSelected = useMemo(
    () => !!Object.keys(bulkSelected).length,
    [bulkSelected]
  );

  const onClickNewCategory = useCallback(() => {
    openDialog('item-form', {});
  }, [openDialog]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={<Menu>{viewsMenuItems}</Menu>}
          minimal={true}
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--table-views')}
            icon={<Icon icon='table' />}
            text='Table Views'
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text='Filter'
            icon={<Icon icon='filter' />}
          />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text='New Item'
          onClick={onClickNewItem}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text='New Category'
          onClick={onClickNewCategory}
        />

        {hasBulkActionsSelected && (
          <Button
            className={Classes.MINIMAL}
            intent={Intent.DANGER}
            icon={<Icon icon='trash' />}
            text='Delete'
          />
        )}

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text='Import'
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text='Export'
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

export default compose(
  DialogConnect,
  DashboardConnect,
  ResourceConnect,
  ItemsConnect
)(ItemsActionsBar);
