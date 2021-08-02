import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import {
  Popover,
  NavbarGroup,
  NavbarDivider,
  PopoverInteractionKind,
  Position,
  Button,
  Classes,
  Intent,
  Switch,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import { If, DashboardActionViewsList } from 'components';

import { useItemsListContext } from './ItemsListProvider';

import withItems from 'containers/Items/withItems';
import withItemsActions from './withItemsActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Items actions bar.
 */
function ItemsActionsBar({
  // #withItems
  itemsSelectedRows,

  // #withItemActions
  setItemsTableState,
  itemsInactiveMode,

  // #withAlertActions
  openAlert,
}) {
  // Items list context.
  const { itemsViews } = useItemsListContext();

  // React intl.

  // History context.
  const history = useHistory();

  // Handle `new item` button click.
  const onClickNewItem = () => {
    history.push('/items/new');
  };

  // Handle tab changing.
  const handleTabChange = (viewId) => {
    setItemsTableState({ customViewId: viewId.id || null });
  };

  // Handle cancel/confirm items bulk.
  const handleBulkDelete = () => {
    openAlert('items-bulk-delete', { itemsIds: itemsSelectedRows });
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setItemsTableState({ inactiveMode: checked });
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
          content={''}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={`${intl.get('filter')}`}
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
        <Switch
          labelElement={<T id={'inactive'} />}
          defaultChecked={itemsInactiveMode}
          onChange={handleInactiveSwitchChange}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withItems(({ itemsSelectedRows, itemsTableState }) => ({
    itemsSelectedRows,
    itemsInactiveMode: itemsTableState.inactiveMode,
  })),
  withItemsActions,
  withAlertActions,
)(ItemsActionsBar);
