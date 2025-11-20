// @ts-nocheck
import React from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Switch,
  Alignment,
} from '@blueprintjs/core';

import {
  Can,
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardActionsBar,
  DashboardRowsHeightButton,
  AdvancedFilterPopover,
} from '@/components';

import { VendorAction, AbilitySubject } from '@/constants/abilityOption';

import { useRefreshVendors } from '@/hooks/query/vendors';
import { useVendorsListContext } from './VendorsListProvider';
import { useHistory } from 'react-router-dom';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useBulkDeleteVendorsDialog } from './hooks/use-bulk-delete-vendors-dialog';
import { isEmpty } from 'lodash';

import withVendors from './withVendors';
import withVendorsActions from './withVendorsActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';

/**
 * Vendors actions bar.
 */
function VendorActionsBar({
  // #withVendors
  vendorsSelectedRows = [],
  vendorsFilterConditions,

  // #withVendorActions
  setVendorsTableState,
  vendorsInactiveMode,

  // #withSettings
  vendorsTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();
  const { openBulkDeleteDialog, isValidatingBulkDeleteVendors } =
    useBulkDeleteVendorsDialog();


  // Vendors list context.
  const { vendorsViews, fields } = useVendorsListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handles new vendor button click.
  const onClickNewVendor = () => {
    history.push('/vendors/new');
  };
  // Vendors refresh action.
  const { refresh } = useRefreshVendors();

  // Handle the active tab change.
  const handleTabChange = (viewSlug) => {
    setVendorsTableState({ viewSlug });
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
  const handleTableRowSizeChange = (size) => {
    addSetting('vendors', 'tableSize', size);
  };
  // Handle import button success.
  const handleImportBtnSuccess = () => {
    history.push('/vendors/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'vendor' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Vendor' });
  };

  const handleBulkDelete = () => {
    openBulkDeleteDialog(vendorsSelectedRows);
  };

  if (!isEmpty(vendorsSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteVendors}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'vendors'}
          views={vendorsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={VendorAction.Create} a={AbilitySubject.Vendor}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_vendor'} />}
            onClick={onClickNewVendor}
          />
          <NavbarDivider />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: vendorsFilterConditions,
            defaultFieldKey: 'display_name',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setVendorsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={vendorsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnSuccess}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={vendorsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={VendorAction.Edit} a={AbilitySubject.Vendor}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={vendorsInactiveMode}
            onChange={handleInactiveSwitchChange}
          />
        </Can>
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
  withSettingsActions,
  withVendors(({ vendorsTableState, vendorsSelectedRows }) => ({
    vendorsSelectedRows,
    vendorsInactiveMode: vendorsTableState.inactiveMode,
    vendorsFilterConditions: vendorsTableState.filterRoles,
  })),
  withSettings(({ vendorsSettings }) => ({
    vendorsTableSize: vendorsSettings?.tableSize,
  })),
  withDialogActions,
)(VendorActionsBar);
