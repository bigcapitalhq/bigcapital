import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouteMatch, useHistory, useParams } from 'react-router-dom';
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
import { If, DashboardActionViewsList } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withItems from 'containers/Items/withItems';
import withItemsActions from './withItemsActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';
import { connect } from 'react-redux';

const ItemsActionsBar = ({
  // #withResourceDetail
  resourceFields,

  // #withItems
  itemsViews,
  itemsSelectedRows,

  //#withItemActions
  addItemsTableQueries,
  changeItemsCurrentView,

  // #withAlertActions
  openAlert,
  onFilterChanged,
}) => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const onClickNewItem = useCallback(() => {
    history.push('/items/new');
  }, [history]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    initialCondition: {
      fieldKey: 'name',
      compatator: 'contains',
      value: '',
    },
    onFilterChange: (filterConditions) => {
      addItemsTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const handleTabChange = (viewId) => {
    changeItemsCurrentView(viewId.id || -1);
    addItemsTableQueries({
      custom_view_id: viewId.id || null,
    });
  };

  // Handle cancel/confirm items bulk.
  const handleBulkDelete = () => {
    openAlert('items-bulk-delete', { itemsIds: itemsSelectedRows });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'items'}
          views={itemsViews}
          onChange={handleTabChange}
        />

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
            text={`${formatMessage({ id: 'filters_applied' })}`}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={itemsSelectedRows.length}>
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
  withItems(({ itemsViews, itemsSelectedRows }) => ({
    itemsViews,
    itemsSelectedRows,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withItemsActions,
  withAlertActions,
)(ItemsActionsBar);
