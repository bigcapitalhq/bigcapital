import React from 'react';

const ProjectDeleteAlert = React.lazy(() => import('./ProjectDeleteAlert'));
const ProjectTaskDeleteAlert = React.lazy(
  () => import('./ProjectTaskDeleteAlert'),
);

/**
 * Project alerts.
 */
export default [
  { name: 'project-delete', component: ProjectDeleteAlert },
  { name: 'project-task-delete', component: ProjectTaskDeleteAlert },
];
