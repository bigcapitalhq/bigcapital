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

import { compose } from 'utils';
import { connect } from 'react-redux';

const ItemsActionsBar = ({
  // #withResourceDetail
  resourceFields,

  // #withItems
  itemsViews,

  //#withItemActions
  addItemsTableQueries,
  changeItemsCurrentView,

  onFilterChanged,
  selectedRows = [],
  onBulkDelete,
}) => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);

  const onClickNewItem = useCallback(() => {
    history.push('/items/new');
  }, [history]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

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

  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

  const handleTabChange = (viewId) => {
    changeItemsCurrentView(viewId.id || -1);
    addItemsTableQueries({
      custom_view_id: viewId.id || null,
    });
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
  withItems(({ itemsViews }) => ({
    itemsViews,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withItemsActions,
)(ItemsActionsBar);
