// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { ProjectDetailHeader } from '../ProjectDetailsHeader';
import { ProjectTimesheetsTable } from './ProjectTimesheetsTable';
import { ProjectTimesheetsProvider } from './ProjectTimesheetsProvider';

/**
 * Project Timesheets.
 * @returns
 */
export default function ProjectTimeSheets() {
  return (
    <ProjectTimesheetsProvider>
      <ProjectDetailHeader />
      <ProjectTimesheetTableCard>
        <ProjectTimesheetsTable />
      </ProjectTimesheetTableCard>
    </ProjectTimesheetsProvider>
  );
}

const ProjectTimesheetTableCard = styled.div`
  margin: 22px 32px;
  border: 1px solid #c8cad0;
  border-radius: 3px;
  background: #fff;
`;
