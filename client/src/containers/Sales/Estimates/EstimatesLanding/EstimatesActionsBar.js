import React from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'components';

import {
  AdvancedFilterPopover,
  If,
  DashboardActionViewsList,
  DashboardFilterButton,
} from 'components';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withEstimatesActions from './withEstimatesActions';
import withEstimates from './withEstimates';

import { useEstimatesListContext } from './EstimatesListProvider';
import { useRefreshEstimates } from 'hooks/query/estimates';

import { compose } from 'utils';

/**
 * Estimates list actions bar.
 */
function EstimateActionsBar({
  // #withEstimateActions
  setEstimatesTableState,

  // #withEstimates
  estimatesFilterRoles,
}) {
  const history = useHistory();

  // Estimates list context.
  const { estimatesViews, fields } = useEstimatesListContext();

  // Handle click a new sale estimate.
  const onClickNewEstimate = () => {
    history.push('/estimates/new');
  };

  // Estimates refresh action.
  const { refresh } = useRefreshEstimates();

  // Handle tab change.
  const handleTabChange = (view) => {
    setEstimatesTableState({
      viewSlug: view ? view.slug : null,
    });
  };

  // Handle click a refresh sale estimates
  const handleRefreshBtnClick = () => {
    refresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'estimates'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={estimatesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_estimate'} />}
          onClick={onClickNewEstimate}
        />
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: estimatesFilterRoles,
            defaultFieldKey: 'estimate_number',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setEstimatesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={estimatesFilterRoles.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
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
  withEstimatesActions,
  withEstimates(({ estimatesTableState }) => ({
    estimatesFilterRoles: estimatesTableState.filterRoles,
  })),
)(EstimateActionsBar);
