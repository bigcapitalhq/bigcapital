// @ts-nocheck
import React from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  Can,
  DashboardActionViewsList,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  DashboardActionsBar,
} from '@/components';
import { ProjectAction, AbilitySubject } from '@/constants/abilityOption';

import withProjects from './withProjects';
import withProjectsActions from './withProjectsActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';

/**
 * Projects actions bar.
 * @returns
 */
function ProjectsActionsBar({
  // #withDialogActions
  openDialog,

  // #withProjects
  projectsFilterRoles,

  // #withProjectsActions
  setProjectsTableState,

  // #withSettings
  projectsTableSize,

  // #withSettingsActions
  addSetting,
}) {
  // Handle tab change.
  const handleTabChange = (view) => {
    setProjectsTableState({
      viewSlug: view ? view.slug : null,
    });
  };

  // Handle click a refresh projects list.
  const handleRefreshBtnClick = () => {};

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('projects', 'tableSize', size);
  };

  // Handle new project button click.
  const handleNewProjectBtnClick = () => {
    openDialog(DialogsName.ProjectForm);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'projects'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={[]}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ProjectAction.Create} a={AbilitySubject.Project}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'projects.label.new_project'} />}
            onClick={handleNewProjectBtnClick}
          />
        </Can>
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
          initialValue={projectsTableSize}
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
  withDialogActions,
  withProjectsActions,
  withSettingsActions,
  withProjects(({ projectsTableState }) => ({
    projectsFilterRoles: projectsTableState?.filterRoles,
  })),
  withSettings(({ projectSettings }) => ({
    projectsTableSize: projectSettings?.tableSize,
  })),
)(ProjectsActionsBar);
