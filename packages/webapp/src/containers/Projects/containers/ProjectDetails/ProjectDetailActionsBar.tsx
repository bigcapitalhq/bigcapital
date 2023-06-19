// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { ProjectTransactionsSelect } from './components';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { projectTranslations } from './common';
import { useProjectDetailContext } from './ProjectDetailProvider';
import { compose } from '@/utils';

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
  const handleNewTransactionBtnClick = ({ path }) => {
    switch (path) {
      case 'project_task':
        openDialog('project-task-form', { projectId });
        break;
      case 'invoicing':
        openDialog('project-invoicing-form');
        break;
      case 'expense':
        openDialog('project-expense-form', { projectId });
        break;
      case 'estimated_expense':
        openDialog('estimated-expense-form', { projectId });
    }
  };

  const handleEditProjectBtnClick = () => {
    openDialog('project-form', {
      projectId,
    });
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('timesheets', 'tableSize', size) &&
      addSetting('sales', 'tableSize', size) &&
      addSetting('purchases', 'tableSize', size) &&
      addSetting('project_tasks', 'tableSize', size);
  };

  const handleTimeEntryBtnClick = () => {
    openDialog('project-time-entry-form', {
      projectId,
    });
  };

  // Handle the refresh button click.
  const handleRefreshBtnClick = () => {};

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <ProjectTransactionsSelect
          transactions={projectTranslations}
          onItemSelect={handleNewTransactionBtnClick}
        />
        <NavbarDivider />
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
