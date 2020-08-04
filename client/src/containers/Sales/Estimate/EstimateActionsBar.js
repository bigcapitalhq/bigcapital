import React, { useMemo, useCallback } from 'react';
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
import { FormattedMessage as T } from 'react-intl';

import { If } from 'components';
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
  selectedRows,
}) {
  const { path } = useRouteMatch();
  const history = useHistory();

  const onClickNewEstimate = useCallback(() => {
    // history.push('/estimates/new');
  }, [history]);

  const filterDropdown = FilterDropdown({
    initialCondition: {
      fieldKey: '',
      compatator: '',
      value: '',
    },
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      addEstimatesTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChange(filterConditions);
    },
  });

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_estimate'} />}
          onClick={onClickNewEstimate}
        />
        <Popover
          minimal={true}
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={'Filter'}
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
  resourceName: 'estimates',
});

const withEstimateActionsBar = connect(mapStateToProps);

export default compose(
  withEstimateActionsBar,
  withDialogActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  // withEstimate(({ estimateViews }) => ({
  //   estimateViews,
  // })),
  withEstimateActions,
)(EstimateActionsBar);
