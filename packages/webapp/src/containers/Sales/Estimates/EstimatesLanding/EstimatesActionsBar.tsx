// @ts-nocheck
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
  DashboardActionsBar,
} from '@/components';

import withEstimates from './withEstimates';
import withEstimatesActions from './withEstimatesActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { useEstimatesListContext } from './EstimatesListProvider';
import { useRefreshEstimates } from '@/hooks/query/estimates';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';

import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';

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

  // #withDialogActions
  openDialog,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Estimates list context.
  const { estimatesViews, fields } = useEstimatesListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

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
  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/estimates/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'sale_estimate' });
  };
  // Handles the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'SaleEstimate' });
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
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
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
  withDialogActions,
)(EstimateActionsBar);
