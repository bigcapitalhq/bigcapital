import React from 'react';
import styled from 'styled-components';

import TimesheetsTable from './TimesheetsTable';
import TimesheetsHeader from './TimesheetsHeader';

/**
 * Project Timesheet.
 * @returns
 */
export default function ProjectTimesheet() {
  return (
    <React.Fragment>
      <TimesheetsHeader />
      <ProjectTimesheetTableCard>
        <TimesheetsTable />
      </ProjectTimesheetTableCard>
    </React.Fragment>
  );
}

const ProjectTimesheetTableCard = styled.div`
  margin: 20px;
  border: 1px solid #c8cad0; // #000a1e33 #f0f0f0
  border-radius: 3px;
  background: #fff;
`;
