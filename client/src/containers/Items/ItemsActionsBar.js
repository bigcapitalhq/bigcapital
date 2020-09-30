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
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import FilterDropdown from 'components/FilterDropdown';
import { If } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import withItems from 'containers/Items/withItems';
import withItemsActions from './withItemsActions';

import { compose } from 'utils';
import { connect } from 'react-redux';

const ItemsActionsBar = ({
  openDialog,

  resourceName = 'items',
  resourceFields,

  // #withItems
  itemsViews,

  //#withItemActions
  addItemsTableQueries,

  onFilterChanged,
  selectedRows = [],
  onBulkDelete,
}) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();
  const viewsMenuItems = itemsViews.map((view) => (
    <MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />
  ));

  const onClickNewItem = useCallback(() => {
    history.push('/items/new');
  }, [history]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  // name
  // const filterDropdown = FilterDropdown({
  //   fields: resourceFields,
  //   onFilterChange: (filterConditions) => {
  //     setFilterCount(filterConditions.length);
  //     onFilterChanged && onFilterChanged(filterConditions);
  //   },
  // });

  const filterDropdown = FilterDropdown({
    initialCondition: {
      fieldKey: 'name',
      compatator: 'contains',
      value: '',
    },
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      addItemsTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  // const onClickNewCategory = useCallback(() => {
  //   openDialog('item-form', {});
  // }, [openDialog]);

  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

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
            icon={<Icon icon="table-16" iconSize={16} />}
            text={<T id={'table_views'} />}
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_item'} />}
          onClick={onClickNewItem}
        />
        <NavbarDivider />

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

const mapStateToProps = (state, props) => ({
  resourceName: 'items',
});

const withItemsActionsBar = connect(mapStateToProps);

export default compose(
  withItemsActionsBar,
  withDialogActions,
  withItems(({ itemsViews }) => ({
    itemsViews,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withItemsActions,
)(ItemsActionsBar);
