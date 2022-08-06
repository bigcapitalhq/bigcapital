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
 * Avatar cell.
 */
export const AvatarCell = ({ row: { original }, size }) => (
  <span className="avatar" data-size={size}>
    {firstLettersArgs(original?.display_name, original?.name)}
  </span>
);

/**
 * Timesheet accessor.
 */
export const TimesheetAccessor = (timesheet) => (
  <React.Fragment>
    <TimesheetHeader>
      <TimesheetTitle>{timesheet.display_name}</TimesheetTitle>
      <TimesheetSubTitle>{timesheet.name}</TimesheetSubTitle>
    </TimesheetHeader>
    <TimesheetContent>
      <FormatDate value={timesheet.date} />
      <TimesheetDescription>{timesheet.description}</TimesheetDescription>
    </TimesheetContent>
  </React.Fragment>
);

const TimesheetHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-flow: wrap;
`;
const TimesheetTitle = styled.span`
  font-weight: 500;
  margin-right: 12px;
  line-height: 1.5rem;
`;

const TimesheetSubTitle = styled.span``;
const TimesheetContent = styled.div`
  display: block;
  white-space: nowrap;
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 0.1rem;
  line-height: 1.2rem;
`;

const TimesheetDescription = styled.span`
  &::before {
    content: '•';
    margin: 0.3rem;
  }
`;
