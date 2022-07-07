import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import {
  FormattedMessage as T,
  AdvancedFilterPopover,
  If,
  Icon,
  Can,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardRowsHeightButton,
} from '@/components';
import DashboardActionsBar from '@/components/Dashboard/DashboardActionsBar';

import withEstimates from './withEstimates';
import withEstimatesActions from './withEstimatesActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { useEstimatesListContext } from './EstimatesListProvider';
import { useRefreshEstimates } from '@/hooks/query/estimates';
import { SaleEstimateAction, AbilitySubject } from '@/common/abilityOption';
import { compose } from '@/utils';

/**
 * Estimates list actions bar.
 */
function EstimateActionsBar({
  // #withEstimateActions
  setEstimatesTableState,

  // #withEstimates
  estimatesFilterRoles,

  // #withSettings
  estimatesTableSize,

  // #withSettingsActions
  addSetting,
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

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('salesEstimates', 'tableSize', size);
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
        <Can I={SaleEstimateAction.Create} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_estimate'} />}
            onClick={onClickNewEstimate}
          />
        </Can>
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
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={estimatesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
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
  withSettingsActions,
  withEstimates(({ estimatesTableState }) => ({
    estimatesFilterRoles: estimatesTableState.filterRoles,
  })),
  withSettings(({ estimatesSettings }) => ({
    estimatesTableSize: estimatesSettings?.tableSize,
  })),
)(EstimateActionsBar);
