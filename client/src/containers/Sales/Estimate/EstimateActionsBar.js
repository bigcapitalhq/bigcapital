import React, { useMemo, useCallback, useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Menu,
  MenuItem,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { If, DashboardActionViewsList } from 'components';
import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withEstimateActions from './withEstimateActions';

import withEstimates from './withEstimates';

import { compose } from 'utils';
import { connect } from 'react-redux';

function EstimateActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withEstimates
  estimateViews,

  // #withEstimateActions
  addEstimatesTableQueries,

  // #own Porps
  onFilterChanged,
  selectedRows = [],
}) {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();

  const onClickNewEstimate = useCallback(() => {
    history.push('/estimates/new');
  }, [history]);

  // const filterDropdown = FilterDropdown({
  //   fields: resourceFields,
  //   initialCondition: {
  //     fieldKey: 'estimate_number',
  //     compatator: 'contains',
  //     value: '',
  //   },
  //   onFilterChange: (filterConditions) => {
  //     setFilterCount(filterConditions.length || 0);
  //     addEstimatesTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //     onFilterChanged && onFilterChanged(filterConditions);
  //   },
  // });

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  const viewsMenuItems = estimateViews.map((view) => {
    return (
      <MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />
    );
  });

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
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_estimate'} />}
          onClick={onClickNewEstimate}
        />
        <Popover
          minimal={true}
          // content={filterDropdown}
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
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            // onClick={handleBulkDelete}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: 'sales_estimates',
});
const withEstimateActionsBar = connect(mapStateToProps);

export default compose(
  withEstimateActionsBar,
  withDialogActions,
  withEstimates(({ estimateViews }) => ({
    estimateViews,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withEstimateActions,
)(EstimateActionsBar);
