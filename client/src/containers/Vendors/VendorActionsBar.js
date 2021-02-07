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
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import { If, DashboardActionViewsList } from 'components';

import { useVendorsListContext } from './VendorsListProvider';
import { useHistory } from 'react-router-dom';

import withVendorActions from './withVendorActions';

import { compose } from 'utils';

/**
 * Vendors actions bar.
 */
function VendorActionsBar({
  // #withVendorActions
  addVendorsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { vendorsViews } = useVendorsListContext();

  const onClickNewVendor = () => {
    history.push('/vendors/new');
  };

  const handleTabChange = (viewId) => {
    addVendorsTableQueries({
      custom_view_id: viewId.id || null,
    });
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
              true ? (
                <T id={'filter'} />
              ) : (
                `${9} ${formatMessage({ id: 'filters_applied' })}`
              )
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withVendorActions,
)(VendorActionsBar);
