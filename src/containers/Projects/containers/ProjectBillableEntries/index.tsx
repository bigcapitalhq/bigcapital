// @ts-nocheck
import React from 'react';
import ProjectBillableEntriesContent from './ProjectBillableEntriesContent';
import { ProjectBillableEntriesProvider } from './ProjectBillableEntriesProvider';

export default function ProjectBillableEntries() {
  return (
    <ProjectBillableEntriesProvider projectId={1}>
      <ProjectBillableEntriesContent />
    </ProjectBillableEntriesProvider>
  );
}
