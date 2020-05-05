import React, { useMemo, useCallback, useState } from 'react';
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
  addItemsTableQueries,
  selectedRows = [],
}) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);

  const viewsMenuItems = views.map(view => 
    (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />));

  const onClickNewItem = () => {
    history.push('/dashboard/items/new');
  };
  const itemsFields = getResourceFields('items');
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [selectedRows]);

  const filterDropdown = FilterDropdown({
    fields: itemsFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length);
      addItemsTableQueries({
        filter_roles: filterConditions || '',  
      });
      onFilterChanged && onFilterChanged(filterConditions);
    }
  });
 
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

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={filterCount <= 0 ? 'Filter' : `${filterCount} filters applied`}
            icon={<Icon icon='filter' />}
          />
        </Popover>

        {hasSelectedRows && (
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
