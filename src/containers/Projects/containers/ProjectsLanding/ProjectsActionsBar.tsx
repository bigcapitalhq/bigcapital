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
  AdvancedFilterPopover,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  FormattedMessage as T,
} from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withProjects from './withProjects';
import withProjectsActions from './withProjectsActions';
import withSettings from '../../../Settings/withSettings';
import withSettingsActions from '../../../Settings/withSettingsActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

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
    openDialog('project-form');
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
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={'New Project'}
          onClick={handleNewProjectBtnClick}
        />
        {/* AdvancedFilterPopover */}

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
