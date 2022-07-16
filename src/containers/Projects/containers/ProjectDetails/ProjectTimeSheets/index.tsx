import React from 'react';
import styled from 'styled-components';

import { ProjectTimesheetsTable } from './ProjectTimesheetsTable';
import { ProjectTimesheetsHeader } from './ProjectTimesheetsHeader';

/**
 * Project Timesheets.
 * @returns
 */
export default function ProjectTimeSheets() {
  return (
    <React.Fragment>
      <ProjectTimesheetsHeader />
      <ProjectTimesheetTableCard>
        <ProjectTimesheetsTable />
      </ProjectTimesheetTableCard>
    </React.Fragment>
  );
}

const ProjectTimesheetTableCard = styled.div`
  margin: 22px 32px;
  border: 1px solid #c8cad0;
  border-radius: 3px;
  background: #fff;
`;
