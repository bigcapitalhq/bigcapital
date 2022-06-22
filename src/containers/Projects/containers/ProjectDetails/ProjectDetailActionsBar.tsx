// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
} from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import {
  Icon,
  FormattedMessage as T,
  DashboardRowsHeightButton,
} from 'components';
import withSettings from '../../../Settings/withSettings';
import withSettingsActions from '../../../Settings/withSettingsActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { useProjectDetailContext } from './ProjectDetailProvider';
import { compose } from 'utils';

/**
 * Project detail actions bar.
 * @returns
 */
function ProjectDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withSettings
  timesheetsTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const { projectId } = useProjectDetailContext();

  // Handle new transaction button click.
  const handleNewTransactionBtnClick = () => {};

  const handleEditProjectBtnClick = () => {
    openDialog('project-form', {
      projectId,
    });
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('timesheets', 'tableSize', size);
  };

  const handleTimeEntryBtnClick = () => {
    openDialog('time-entry-form', {
      projectId,
    });
  };

  // Handle the refresh button click.
  const handleRefreshBtnClick = () => {};

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'projcet_details.action.new_transaction'} />}
          onClick={handleNewTransactionBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'time-24'} iconSize={16} />}
          text={<T id={'projcet_details.action.time_entry'} />}
          onClick={handleTimeEntryBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'projcet_details.action.edit_project'} />}
          onClick={handleEditProjectBtnClick}
        />
        <NavbarDivider />
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
          initialValue={timesheetsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
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
  withDialogActions,
  withSettingsActions,
  withSettings(({ timesheetsSettings }) => ({
    timesheetsTableSize: timesheetsSettings?.tableSize,
  })),
)(ProjectDetailActionsBar);
