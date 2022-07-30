import React from 'react';

const ProjectDeleteAlert = React.lazy(() => import('./ProjectDeleteAlert'));
const ProjectTaskDeleteAlert = React.lazy(
  () => import('./ProjectTaskDeleteAlert'),
);
const ProjectTimesheetDeleteAlert = React.lazy(
  () => import('./ProjectTimesheetDeleteAlert'),
);

/**
 * Project alerts.
 */
export default [
  { name: 'project-delete', component: ProjectDeleteAlert },
  { name: 'project-task-delete', component: ProjectTaskDeleteAlert },
  { name: 'project-timesheet-delete', component: ProjectTimesheetDeleteAlert },
];
