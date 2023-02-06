// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FormatDate, Icon } from '@/components';
import { Menu, MenuItem, Intent } from '@blueprintjs/core';
import { safeCallback, firstLettersArgs } from '@/utils';

/**
 * Table actions cell.
 */
export function ActionsMenu({
  payload: { onDelete, onEdit },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('timesheets.action.edit_timesheet')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('timesheets.action.delete_timesheet')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Timesheet accessor.
 */
export const TimesheetAccessor = (timesheet) => (
  <React.Fragment>
    <TimesheetHeader>
      <TimesheetTitle>{timesheet.customer_name}</TimesheetTitle>
      <TimesheetSubTitle>{timesheet.task_name}</TimesheetSubTitle>
    </TimesheetHeader>
    <TimesheetContent>
      <FormatDate value={timesheet.date} />
      {timesheet.description && (
        <TimesheetDescription>{timesheet.description}</TimesheetDescription>
      )}
    </TimesheetContent>
  </React.Fragment>
);

const TimesheetHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-flow: wrap;
`;
const TimesheetTitle = styled.span`
  font-weight: 600;
  margin-right: 8px;
`;
const TimesheetSubTitle = styled.span`
  font-size: 13px;
  opacity: 0.9;
`;
const TimesheetContent = styled.div`
  display: block;
  white-space: nowrap;
  font-size: 13px;
  color: #5D5E71;
  margin-top: 0.25rem;
`;

const TimesheetDescription = styled.span`
  &::before {
    content: '•';
    margin: 0.3rem;
  }
`;
