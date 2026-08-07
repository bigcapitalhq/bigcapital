// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ProjectDetailHeader } from '../ProjectDetailsHeader';
import { ProjectTaskProvider } from './ProjectTaskProvider';
import { ProjectTasksTable } from './ProjectTasksTable';

export function ProjectTasks() {
  return (
    <ProjectTaskProvider>
      <ProjectDetailHeader />
      <ProjectTasksTableCard>
        <ProjectTasksTable />
      </ProjectTasksTableCard>
    </ProjectTaskProvider>
  );
}

const ProjectTasksTableCard = styled.div`
  margin: 22px 32px;
  border: 1px solid #c8cad0;
  border-radius: 3px;
  background: #fff;
`;
