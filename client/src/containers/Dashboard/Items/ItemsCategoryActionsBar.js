import React, { useMemo } from 'react';
import {} from 'reselect';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { compose } from 'utils';
import {
  NavbarGroup,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemsCategoryConnect from 'connectors/ItemsCategory.connect';
import DialogConnect from 'connectors/Dialog.connector';
import FilterDropdown from 'components/FilterDropdown';
import ResourceConnect from 'connectors/Resource.connector';

const ItemsCategoryActionsBar = ({
  openDialog,
  onDeleteCategory,
  onFilterChanged,
  getResourceFields,
}) => {
  const onClickNewCategory = () => {
    openDialog('item-form', {});
  };

  const handleDeleteCategory = (category) => {
    onDeleteCategory(category);
  };

  const categoriesFields = getResourceFields('itemCategories');

  const filterDropdown = FilterDropdown({
    fields: categoriesFields,
    onFilterChange: (filterConditions) => {
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });
  return (
    <DashboardActionsBar>
      <NavbarGroup>
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
            text='Filter'
            icon={<Icon icon='filter' />}
          />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='trash' iconSize={15} />}
          text='Delete Category'
          intent={Intent.DANGER}
          onClick={handleDeleteCategory}
        />

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
  ItemsCategoryConnect,
  ResourceConnect
)(ItemsCategoryActionsBar);
