import React, { useCallback, useMemo, useState } from 'react';
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
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, DashboardActionViewsList } from 'components';

import withVendors from './withVendors';
import withVendorActions from './withVendorActions';
import { compose } from 'utils';

function VendorActionsBar({
  // #withVendors
  vendorViews,

  // #withVendorActions
  addVendorsTableQueries,
  changeVendorView,

  // #ownProps
  selectedRows = [],
}) {
  const [filterCount, setFilterCount] = useState(0);
  const history = useHistory();
  const { formatMessage } = useIntl();

  const onClickNewVendor = useCallback(() => {
    history.push('/vendors/new');
  }, [history]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const handleTabChange = (viewId) => {
    changeVendorView(viewId.id || -1);
    addVendorsTableQueries({
      custom_view_id: viewId.id || null,
    });
  };
  
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'vendors'}
          views={vendorViews}
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
const mapStateToProps = (state, props) => ({
  resourceName: 'vendors',
});
const withVendorsActionsBar = connect(mapStateToProps);

export default compose(
  withVendorsActionsBar,
  withVendorActions,
  withVendors(({ vendorViews }) => ({ vendorViews })),
)(VendorActionsBar);
