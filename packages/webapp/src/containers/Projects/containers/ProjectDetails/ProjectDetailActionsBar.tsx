// @ts-nocheck
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { projectTranslations } from './common';
import { ProjectTransactionsSelect } from './components';
import { useProjectDetailContext } from './ProjectDetailProvider';
import {
  Icon,
  FormattedMessage as T,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Project detail actions bar.
 * @returns
 */
function ProjectDetailActionsBarInner({
  // #withDialogActions
  openDialog,
}) {
  // Settings hook.
  const { projectId, timesheetsSettings } = useProjectDetailContext();
  const timesheetsTableSize = timesheetsSettings?.tableSize;
  const { mutateAsync: saveSettings } = useSaveSettings();

  // Handle new transaction button click.
  const handleNewTransactionBtnClick = ({ path }) => {
    switch (path) {
      case 'project_task':
        openDialog('project-task-form', { projectId });
        break;
      case 'invoincing':
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
    saveSettings({
      options: [
        { group: 'timesheets', key: 'tableSize', value: size },
        { group: 'sales', key: 'tableSize', value: size },
        { group: 'purchases', key: 'tableSize', value: size },
        { group: 'project_tasks', key: 'tableSize', value: size },
      ],
    });
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
export const ProjectDetailActionsBar = compose(withDialogActions)(
  ProjectDetailActionsBarInner,
);
