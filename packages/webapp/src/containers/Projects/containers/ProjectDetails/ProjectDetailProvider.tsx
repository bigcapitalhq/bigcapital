// @ts-nocheck
import React from 'react';
import { useProject } from '../../hooks';
import { DashboardInsider } from '@/components';
import {
  useSettingsProjects,
  useSettingsProjectTasks,
  useSettingsTimesheets,
} from '@/hooks/query';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

const ProjectDetailContext = React.createContext();

/**
 * Project detail provider.
 * @returns
 */
function ProjectDetailProvider({
  projectId,
  // #ownProps
  ...props
}) {
  // Handle fetch project detail.
  const { data: project, isLoading: isProjectLoading } = useProject(projectId, {
    enabled: !!projectId,
  });

  // Settings hooks.
  const { data: projectSettings } = useSettingsProjects();
  const { data: projectTasksSettings } = useSettingsProjectTasks();
  const { data: timesheetsSettings } = useSettingsTimesheets();

  // State provider.
  const provider = {
    project,
    projectId,

    projectSettings: projectSettings as SettingsGroup | undefined,
    projectTasksSettings: projectTasksSettings as SettingsGroup | undefined,
    timesheetsSettings: timesheetsSettings as SettingsGroup | undefined,
  };
  return (
    <DashboardInsider loading={isProjectLoading}>
      <ProjectDetailContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectDetailContext = () => React.useContext(ProjectDetailContext);

export { ProjectDetailProvider, useProjectDetailContext };
