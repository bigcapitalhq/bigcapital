import React from 'react';
import styled from 'styled-components';

import { ProjectTasksHeader } from './ProjectTasksHeader';
import { ProjectTasksTable } from './ProjectTasksTable';
import { ProjectTaskProvider } from './ProjectTaskProvider';

export default function ProjectTasks() {
  return (
    <ProjectTaskProvider>
      <ProjectTasksHeader />
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
