import React from 'react';
import styled from 'styled-components';

import TimesheetsTable from './TimesheetsTable';
import TimesheetsHeader from './TimesheetsHeader';

/**
 * Project Timesheet.
 * @returns
 */
export default function TimeSheets() {
  return (
    <React.Fragment>
      <TimesheetsHeader />
      <TimesheetTableCard>
        <TimesheetsTable />
      </TimesheetTableCard>
    </React.Fragment>
  );
}

const TimesheetTableCard = styled.div`
  margin: 22px 32px;
  border: 1px solid #c8cad0; // #000a1e33 #f0f0f0
  border-radius: 3px;
  background: #fff;
`;
