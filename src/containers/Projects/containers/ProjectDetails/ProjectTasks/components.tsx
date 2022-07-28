import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Icon } from '@/components';
import { Menu, MenuItem, Intent } from '@blueprintjs/core';
import { safeCallback } from '@/utils';

/**
 * Table actions cell.
 */
export function ActionsMenu({
  payload: { onEdit, onDelete },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('project_task.action.edit_task')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('project_task.action.delete_task')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

export function TaskAccessor(row) {
  return (
    <TaskRoot>
      <TaskHeader>
        <TaskTitle>{row.name}</TaskTitle>
      </TaskHeader>
      <TaskContent>
        {row.charge_type === 'hourly_rate'
          ? row.rate + ' / hour'
          : row.charge_type}
        <TaskDescription>{row.estimate_minutes} estimated</TaskDescription>
      </TaskContent>
    </TaskRoot>
  );
}

const TaskRoot = styled.div`
  margin-left: 12px;
`;
const TaskHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-flow: wrap;
`;
const TaskTitle = styled.span`
  font-weight: 500;
  /* margin-right: 12px; */
  line-height: 1.5rem;
`;
const TaskContent = styled.div`
  display: block;
  white-space: nowrap;
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 0.1rem;
  line-height: 1.2rem;
`;
const TaskDescription = styled.span`
  &::before {
    content: '•';
    margin: 0.3rem;
  }
`;
