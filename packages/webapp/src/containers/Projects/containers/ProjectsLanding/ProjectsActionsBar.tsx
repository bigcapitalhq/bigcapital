// @ts-nocheck
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
} from '@blueprintjs/core';
import React from 'react';
import { withProjects } from './withProjects';
import { withProjectsActions } from './withProjectsActions';
import { useProjectsListContext } from './ProjectsListProvider';
import {
  Icon,
  Can,
  DashboardActionViewsList,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  DashboardActionsBar,
} from '@/components';
import { ProjectAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Projects actions bar.
 * @returns
 */
function ProjectsActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withProjects
  projectsFilterRoles,

  // #withProjectsActions
  setProjectsTableState,
}) {
  // Settings hook.
  const { projectSettings } = useProjectsListContext();
  const projectsTableSize = projectSettings?.tableSize;
  const { mutateAsync: saveSettings } = useSaveSettings();
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
    saveSettings({
      options: [{ group: 'projects', key: 'tableSize', value: size }],
    });
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

export const ProjectsActionsBar = compose(
  withDialogActions,
  withProjectsActions,
  withProjects(({ projectsTableState }) => ({
    projectsFilterRoles: projectsTableState?.filterRoles,
  })),
)(ProjectsActionsBarInner);
