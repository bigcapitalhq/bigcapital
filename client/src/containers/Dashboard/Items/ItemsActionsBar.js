import React, {useMemo} from 'react';
import {useRouteMatch} from 'react-router-dom'
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { compose } from 'utils';
import {
  MenuItem,
  Popover,
  Menu,
  PopoverInteractionKind,
  Position,
  Button,
  Classes,
} from '@blueprintjs/core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import DashboardConnect from 'connectors/Dashboard.connector';
import ResourceConnect from 'connectors/Resource.connector'
import FilterDropdown from 'components/FilterDropdown';
import ItemsConnect from 'connectors/Items.connect';

const ItemsActionsBar = ({
  getResourceFields,
  getResourceViews,
  views,
  onFilterChange,
  bulkSelected,
}) => {
  const {path} = useRouteMatch();
  const viewsMenuItems = views.map((view) => {
    return (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />);
  });

  const onClickNewItem = () => {
    
  };
  const itemsFields = getResourceFields('items');

  const filterDropdown = FilterDropdown({
    fields: itemsFields,
    onFilterChange,
  });

  const hasBulkActionsSelected = useMemo(() => 
    !!Object.keys(bulkSelected).length, [bulkSelected]);

  return (
    <DashboardActionsBar>
      <Popover
        content={<Menu>{viewsMenuItems}</Menu>}
        minimal={true}
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.BOTTOM_LEFT}>
        
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={ <Icon icon="table" /> }
          text="Table Views"
          rightIcon={'caret-down'} />
      </Popover>

      <Popover
        content={filterDropdown}
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.BOTTOM_LEFT}>

        <Button
          className={classNames(Classes.MINIMAL, 'button--filter')}
          text="Filter"
          icon={ <Icon icon="filter" /> } />
      </Popover>

      <Button
        className={Classes.MINIMAL}
        icon={ <Icon icon="plus" /> }
        text="New Item"
        onClick={onClickNewItem} />

      {hasBulkActionsSelected && (
        <Button
          className={Classes.MINIMAL}
          icon={ <Icon icon="trash" />} 
          text="Delete" />)}

    </DashboardActionsBar>
  );
};

export default compose(
  DashboardConnect,
  ResourceConnect,
  ItemsConnect,
)(ItemsActionsBar);