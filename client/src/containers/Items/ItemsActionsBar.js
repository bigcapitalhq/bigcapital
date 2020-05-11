import React, { useMemo, useCallback, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import classNames from 'classnames';
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
import { compose } from 'utils';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import FilterDropdown from 'components/FilterDropdown';
import DialogConnect from 'connectors/Dialog.connector';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import withItems from 'containers/Items/withItems';
import { If } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';

const ItemsActionsBar = ({
  openDialog,

  resourceName = 'items',
  resourceFields,

  // #withItems
  itemsViews,

  onFilterChanged,
  selectedRows = [],
}) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);

  const viewsMenuItems = itemsViews.map(view => 
    (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />));

  const onClickNewItem = () => {
    history.push('/dashboard/items/new');
  };
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [selectedRows]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length);
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
            text={<T id={'table_views'}/>}
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text={<T id={'new_item'}/>}
          onClick={onClickNewItem}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text={<T id={'new_category'}/>}
          onClick={onClickNewCategory}
        />

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={filterCount <= 0 ? <T id={'filter'}/> : `${filterCount} filters applied`}
            icon={<Icon icon='filter' />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            intent={Intent.DANGER}
            icon={<Icon icon='trash' />}
            text={<T id={'delete'}/>}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text={<T id={'import'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text={<T id={'export'}/>}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

export default compose(
  DialogConnect,
  withItems(({ itemsViews }) => ({
    itemsViews,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
)(ItemsActionsBar);
