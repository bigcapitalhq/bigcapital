import React from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
  Switch,
  Alignment,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import { If, DashboardActionViewsList } from 'components';

import { useRefreshVendors } from 'hooks/query/vendors';
import { useVendorsListContext } from './VendorsListProvider';
import { useHistory } from 'react-router-dom';

import withVendorsActions from './withVendorsActions';
import withVendors from './withVendors';

import { compose } from 'utils';

/**
 * Vendors actions bar.
 */
function VendorActionsBar({
  // #withVendorActions
  setVendorsTableState,
  vendorsInactiveMode,
}) {
  const history = useHistory();

  // Vendors list context.
  const { vendorsViews } = useVendorsListContext();

  // Handles new vendor button click.
  const onClickNewVendor = () => {
    history.push('/vendors/new');
  };

  // Vendors refresh action.
  const { refresh } = useRefreshVendors();

  // Handle the active tab change.
  const handleTabChange = (customView) => {
    setVendorsTableState({ customViewId: customView.id || null });
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setVendorsTableState({ inactiveMode: checked });
  };

  // Handle click a refresh sale estimates
  const handleRefreshBtnClick = () => {
    refresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'vendors'}
          views={vendorsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_vendor'} />}
          onClick={onClickNewVendor}
        />
        <NavbarDivider />
        <Popover
          // content={}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={
              true ? <T id={'filter'} /> : `${9} ${intl.get('filters_applied')}`
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>
        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
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
          defaultChecked={vendorsInactiveMode}
          onChange={handleInactiveSwitchChange}
        />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withVendorsActions,
  withVendors(({ vendorsTableState }) => ({
    vendorsInactiveMode: vendorsTableState.inactiveMode,
  })),
)(VendorActionsBar);
