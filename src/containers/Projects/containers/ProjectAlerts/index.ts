import React from 'react';

const ProjectDeleteAlert = React.lazy(() => import('./ProjectDeleteAlert'));

/**
 * Project alerts.
 */
export default [{ name: 'project-delete', component: ProjectDeleteAlert }];
